import "dotenv/config";

import path from "path";

import { readdirSync } from "fs";

import { Client, Collection } from "discord.js";

import { REST } from "@discordjs/rest";

import { Routes } from "discord-api-types/v10";

const bot = new Client({ intents: [] });

const commands = new Collection();

const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN!);

bot.commands = commands;

const eventFiles = readdirSync(path.resolve(__dirname, "./events")).filter(file => file.endsWith(".js"));

for (const file of eventFiles) {

    const event = require(`./events/${file}`);

    if (event.once) bot.once(event.name, (...args) => event.execute(bot, ...args));

    else bot.on(event.name, (...args) => event.execute(bot, ...args));
    
}

const commandsData: any[] = [];

const commandFiles = readdirSync(path.resolve(__dirname, "./commands")).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {

    try {

        const command = require(`./commands/${file}`);

        if (command.info.disabled) {

            console.log(`Skipped ${command.info.displayName} Command`);

            continue;

        }

        commandsData.push(command.data.toJSON());

        bot.commands.set(command.data.name, command);

        console.log(`Loaded ${command.info.displayName} Command`);

    } catch (err) { 
        
        console.error(`Failed To Load A Command (${file})! | ${err}`); 
    
    }
    
}

bot.login(process.env.BOT_TOKEN).then(() => {
    
    rest.put(Routes.applicationCommands(bot.application?.id!), { body: commandsData })

        .then(() => console.log("Successfully Registered Application Commands!"))

        .catch(console.error);

});