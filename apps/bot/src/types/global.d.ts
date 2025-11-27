export type BoardType = "normal" | "minecraft";

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            readonly BOT_TOKEN: string;
            readonly BOARD_IMAGE_URL: string;
        }
    }
}
