import {
    AttachmentBuilder,
    type ChatInputCommandInteraction,
    SlashCommandBuilder,
} from "discord.js";

import getBoard from "../utilities/canvas";

module.exports = {
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
            option.setName("text").setDescription("Board Text").setRequired(true),
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const boardText = interaction.options.getString("text", true);

        if (boardText.length > 8)
            return interaction.reply({
                content: "The shown text has a limit of 8 characters",
                ephemeral: true,
            });

        const boardImage = await getBoard(boardText, "normal");

        const attachment = new AttachmentBuilder(boardImage, { name: `board-${boardText}.png` });

        interaction.reply({ files: [attachment] });
    },
};
