import { AttachmentBuilder, type ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import type { Command } from "../types/discord.js";
import { createBoard } from "../utilities/canvas.js";

const MAX_TEXT_LENGTH = 8;

export default {
    info: {
        name: "board",
        displayName: "Board",
        description: "A command to create a Pepe Board",
        usage: "/board <Board Text>",
        disabled: false,
    },

    data: new SlashCommandBuilder()
        .setName("board")
        .setDescription("A command to create a Pepe Board")
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

        const boardImage = await createBoard(boardText, "normal");
        const attachment = new AttachmentBuilder(boardImage, { name: `board-${boardText}.png` });

        await interaction.reply({ files: [attachment] });
    },
} satisfies Command;
