import type { Client, Interaction } from "discord.js";
import type { BotEvent } from "../types/discord.js";

export default {
    name: "interactionCreate",
    once: false,

    async execute(bot: Client, interaction: Interaction): Promise<void> {
        if (!interaction.isChatInputCommand() || interaction.user.bot) {
            return;
        }

        const command = bot.commands.get(interaction.commandName);

        if (!command) {
            console.warn(`Unknown command: ${interaction.commandName}`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`Error executing command ${interaction.commandName}:`, error);

            const errorMessage = "An error occurred while executing this command.";

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: errorMessage, ephemeral: true });
            } else {
                await interaction.reply({ content: errorMessage, ephemeral: true });
            }
        }
    },
} satisfies BotEvent<"interactionCreate">;
