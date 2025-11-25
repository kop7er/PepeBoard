import {
    AttachmentBuilder,
    type ChatInputCommandInteraction,
    SlashCommandBuilder,
} from "discord.js";

import getBoard from "../utilities/canvas";

module.exports = {
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
            option.setName("text").setDescription("Board Text").setRequired(true),
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const boardText = interaction.options.getString("text", true);

        if (boardText.length > 5)
            return interaction.reply({
                content: "The shown text has a limit of 5 characters",
                ephemeral: true,
            });

        const boardImage = await getBoard(boardText, "minecraft");

        const attachment = new AttachmentBuilder(boardImage, {
            name: `board-minecraft-${boardText}.png`,
        });

        interaction.reply({ files: [attachment] });
    },
};
