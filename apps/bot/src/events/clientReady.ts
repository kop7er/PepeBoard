import { fileURLToPath } from "node:url";
import { registerFont } from "canvas";
import type { Client } from "discord.js";
import type { BotEvent } from "../types/discord.js";

const FONTS_DIR = fileURLToPath(new URL("../../fonts/", import.meta.url));

const STATUS_UPDATE_INTERVAL = 30 * 60 * 1000; // 30 minutes

const updateBotStatus = (bot: Client): void => {
    bot.user?.setActivity(`PepeBoard.xyz | ${bot.guilds.cache.size} Servers`);
};

export default {
    name: "clientReady",
    once: true,

    execute(bot: Client): void {
        console.log(`${bot.user?.username} Discord Bot is now online!`);

        registerFont(`${FONTS_DIR}Lato-Bold.ttf`, { family: "Lato-Bold" });
        registerFont(`${FONTS_DIR}Minecraftia-Regular.ttf`, { family: "Minecraftia-Regular" });

        updateBotStatus(bot);

        setInterval(() => updateBotStatus(bot), STATUS_UPDATE_INTERVAL);
    },
} satisfies BotEvent<"clientReady">;
