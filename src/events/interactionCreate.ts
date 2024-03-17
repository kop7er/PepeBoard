import { Client, Interaction } from "discord.js";

module.exports = {

    name: "interactionCreate",

    once: false,

    async execute(bot: Client, interaction: Interaction) {

        try {

            if (!interaction.isCommand() || interaction.user.bot) return;

            bot.commands.get(interaction.commandName)?.execute(interaction);

        } catch (error) {

            console.error(error);

        }

    }

}
