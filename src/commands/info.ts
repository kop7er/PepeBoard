import { ChatInputCommandInteraction, EmbedBuilder, HexColorString, SlashCommandBuilder } from "discord.js";

module.exports = {

    info: {

        name: "info",

        displayName: "Info",

        description: "Shows useful information about the bot",

        usage: "/info",

        disabled: false

    },

	data: new SlashCommandBuilder()
		.setName("info")
		.setDescription("Shows useful information about the bot"),

	async execute(interaction: ChatInputCommandInteraction) {
        
        const embedMessage = new EmbedBuilder();

        embedMessage.setTitle("Pepe Board")

        embedMessage.setThumbnail(process.env.BOARD_IMAGE_URL!)
        
        embedMessage.setColor("#" + process.env.EMBED_COLOR! as HexColorString)

        embedMessage.setDescription("A bot to design your own Pepe Boards without using any editing software!")

        embedMessage.addFields([
            { name: "Support Server", value: "https://discord.gg/KRqDu5X"},
            { name: "Invite Link", value: "[Click Here](https://discord.com/oauth2/authorize?client_id=750365877844574248&scope=bot%20applications.commands&permissions=412317173824&redirect_uri=https%3A%2F%2Fpepeboard.xyz)"},
            { name: "GitHub", value: "https://github.com/Kop7er/PepeBoard" }
        ])

        interaction.reply({ embeds: [ embedMessage ] });

    }

};