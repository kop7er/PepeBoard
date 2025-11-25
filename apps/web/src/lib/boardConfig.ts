export type BoardType = "normal" | "minecraft";

export type BoardVariant = {
    id: BoardType;
    label: string;
    description: string;
    maxChars: number;
    fontFamily: string;
    baseFontSize: number;
    textYDivisor: number;
    accent: string;
};

export const BOARD_VARIANTS: Record<BoardType, BoardVariant> = {
    normal: {
        id: "normal",
        label: "Classic Board",
        description: "Matches the /board command and uses the bold Pepe Board font.",
        maxChars: 8,
        fontFamily: '"PepeBoard Lato"',
        baseFontSize: 26,
        textYDivisor: 3.4,
        accent: "from-emerald-400 to-lime-300",
    },
    minecraft: {
        id: "minecraft",
        label: "Minecraft Font",
        description: "Retro pixel font used by the /minecraft command.",
        maxChars: 5,
        fontFamily: '"Minecraftia"',
        baseFontSize: 26,
        textYDivisor: 2.2,
        accent: "from-amber-300 to-orange-400",
    },
};

export const DEFAULT_BOARD_TEXT = "PEPE";
export const FALLBACK_BOARD_SIZE = { width: 512, height: 512 };
