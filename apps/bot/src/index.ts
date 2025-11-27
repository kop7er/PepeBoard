import "dotenv/config";
import { readdir } from "node:fs/promises";
import { REST } from "@discordjs/rest";
import { Client, Collection } from "discord.js";
import { Routes } from "discord-api-types/v10";
import type { BotEvent, Command } from "./types/discord.js";

const bot = new Client({ intents: [] });
const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);

bot.commands = new Collection<string, Command>();

async function loadEvents(): Promise<void> {
    const eventsDir = new URL("./events/", import.meta.url);
    const eventFiles = await readdir(eventsDir);

    for (const file of eventFiles.filter((f) => f.endsWith(".js") && f !== "types.js")) {
        const eventModule = (await import(`./events/${file}`)) as { default: BotEvent };
        const event = eventModule.default;

        if (event.once) {
            bot.once(event.name, (...args) => event.execute(bot, ...args));
        } else {
            bot.on(event.name, (...args) => event.execute(bot, ...args));
        }
    }
}

async function loadCommands(): Promise<ReturnType<Command["data"]["toJSON"]>[]> {
    const commandsData: ReturnType<Command["data"]["toJSON"]>[] = [];
    const commandsDir = new URL("./commands/", import.meta.url);
    const commandFiles = await readdir(commandsDir);

    for (const file of commandFiles.filter((f) => f.endsWith(".js"))) {
        try {
            const commandModule = (await import(`./commands/${file}`)) as { default: Command };
            const command = commandModule.default;

            if (command.info.disabled) {
                console.log(`Skipped ${command.info.displayName} Command`);
                continue;
            }

            commandsData.push(command.data.toJSON());
            bot.commands.set(command.data.name, command);

            console.log(`Loaded ${command.info.displayName} Command`);
        } catch (err) {
            console.error(`Failed To Load A Command (${file})!`, err);
        }
    }

    return commandsData;
}

async function registerCommands(commandsData: ReturnType<Command["data"]["toJSON"]>[]): Promise<void> {
    if (!bot.application?.id) {
        throw new Error("Bot application ID is not available");
    }

    await rest.put(Routes.applicationCommands(bot.application.id), { body: commandsData });
    console.log("Successfully Registered Application Commands!");
}

async function main(): Promise<void> {
    await loadEvents();
    const commandsData = await loadCommands();

    await bot.login(process.env.BOT_TOKEN);
    await registerCommands(commandsData);
}

main().catch(console.error);
