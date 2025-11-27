import type { Canvas } from "canvas";
import type { BoardType } from "../types/global.js";

export interface TextLocation {
    readonly x: number;
    readonly y: number;
}

const LOCATION_DIVISORS: Record<BoardType, TextLocation> = {
    normal: { x: 2.0, y: 3.4 },
    minecraft: { x: 2.0, y: 2.2 },
} as const;

export function getBoardTextLocation(boardType: BoardType, canvas: Canvas): TextLocation {
    const divisors = LOCATION_DIVISORS[boardType];

    return {
        x: canvas.width / divisors.x,
        y: canvas.height / divisors.y,
    };
}
