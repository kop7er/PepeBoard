import type {
    ChatInputCommandInteraction,
    Client,
    ClientEvents,
    Collection,
    SlashCommandBuilder,
    SlashCommandOptionsOnlyBuilder,
} from "discord.js";

export interface BotEvent<K extends keyof ClientEvents = keyof ClientEvents> {
    readonly name: K;
    readonly once: boolean;
    execute(bot: Client, ...args: ClientEvents[K]): void | Promise<void>;
}

export interface CommandInfo {
    readonly name: string;
    readonly displayName: string;
    readonly description: string;
    readonly usage: string;
    readonly disabled: boolean;
}

export interface Command {
    readonly info: CommandInfo;
    readonly data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
    execute(interaction: ChatInputCommandInteraction): Promise<void>;
}

declare module "discord.js" {
    interface Client {
        commands: Collection<string, Command>;
    }
}
