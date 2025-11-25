import { registerFont } from "canvas";
import type { Client } from "discord.js";
import path from "path";

module.exports = {
    name: "ready",

    once: true,

    async execute(bot: Client) {
        console.log(`${bot.user?.username} Discord Bot is now online!`);

        bot.user?.setActivity(`PepeBoard.xyz | ${bot.guilds.cache.size} Servers`);

        setInterval(
            () => bot.user?.setActivity(`PepeBoard.xyz | ${bot.guilds.cache.size} Servers`),
            1800000,
        );

        registerFont(path.resolve(__dirname, "../../fonts/Lato-Bold.ttf"), { family: "Lato-Bold" });

        registerFont(path.resolve(__dirname, "../../fonts/Minecraftia-Regular.ttf"), {
            family: "Minecraftia-Regular",
        });
    },
};
