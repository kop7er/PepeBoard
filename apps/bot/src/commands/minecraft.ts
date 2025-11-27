import { AttachmentBuilder, type ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import type { Command } from "../types/discord.js";
import { createBoard } from "../utilities/canvas.js";

const MAX_TEXT_LENGTH = 5;

export default {
    info: {
        name: "minecraft",
        displayName: "Minecraft",
        description: "A command to create a Pepe Board but with the Minecraft font",
        usage: "/minecraft <Board Text>",
        disabled: false,
    },

    data: new SlashCommandBuilder()
        .setName("minecraft")
        .setDescription("A command to create a Pepe Board but with the Minecraft font")
        .addStringOption((option) =>
            option
                .setName("text")
                .setDescription("Board Text")
                .setRequired(true)
                .setMaxLength(MAX_TEXT_LENGTH),
        ),

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const boardText = interaction.options.getString("text", true);

        if (boardText.length > MAX_TEXT_LENGTH) {
            await interaction.reply({
                content: `The shown text has a limit of ${MAX_TEXT_LENGTH} characters`,
                ephemeral: true,
            });
            return;
        }

        const boardImage = await createBoard(boardText, "minecraft");
        const attachment = new AttachmentBuilder(boardImage, {
            name: `board-minecraft-${boardText}.png`,
        });

        await interaction.reply({ files: [attachment] });
    },
} satisfies Command;
