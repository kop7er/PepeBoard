import type { BoardType } from "../types/global.js";

const FONT_SIZE = 26;

const FONTS: Record<BoardType, string> = {
    normal: `${FONT_SIZE}px Lato-Bold`,
    minecraft: `${FONT_SIZE}px Minecraftia-Regular`,
} as const;

export function getBoardFont(boardType: BoardType): string {
    return FONTS[boardType];
}
