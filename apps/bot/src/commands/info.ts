import { type ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { Command } from "../types/discord.js";

const BOT_INFO = {
    title: "Pepe Board",
    description: "A bot to design your own Pepe Boards without using any editing software!",
    supportServer: "https://discord.gg/KRqDu5X",
    inviteLink:
        "https://discord.com/oauth2/authorize?client_id=750365877844574248&scope=bot%20applications.commands&permissions=412317173824&redirect_uri=https%3A%2F%2Fpepeboard.xyz",
    github: "https://github.com/kop7er/PepeBoard",
} as const;

export default {
    info: {
        name: "info",
        displayName: "Info",
        description: "Shows useful information about the bot",
        usage: "/info",
        disabled: false,
    },

    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Shows useful information about the bot"),

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const embed = new EmbedBuilder()
            .setTitle(BOT_INFO.title)
            .setThumbnail(process.env.BOARD_IMAGE_URL)
            .setColor("#16a34a")
            .setDescription(BOT_INFO.description)
            .addFields([
                { name: "Support Server", value: BOT_INFO.supportServer },
                { name: "Invite Link", value: `[Click Here](${BOT_INFO.inviteLink})` },
                { name: "GitHub", value: BOT_INFO.github },
            ]);

        await interaction.reply({ embeds: [embed] });
    },
} satisfies Command;
