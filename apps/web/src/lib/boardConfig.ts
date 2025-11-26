export type BoardType = "normal" | "minecraft";

export type BoardVariant = {
    id: BoardType;
    label: string;
    fontFamily: string;
};

export const BOARD_VARIANTS: Record<BoardType, BoardVariant> = {
    normal: {
        id: "normal",
        label: "Classic Board",
        fontFamily: '"PepeBoard Lato"',
    },
    minecraft: {
        id: "minecraft",
        label: "Minecraft Font",
        fontFamily: '"Minecraftia"',
    },
};

export const FALLBACK_BOARD_SIZE = { width: 512, height: 512 };
