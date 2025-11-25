import type { Canvas } from "canvas";

export default function getBoardTextLocation(
    boardType: BoardType,
    canvas: Canvas,
): { x: number; y: number } {
    switch (boardType) {
        case "normal":
            return {
                x: canvas.width / 2.0,

                y: canvas.height / 3.4,
            };

        case "minecraft":
            return {
                x: canvas.width / 2.0,

                y: canvas.height / 2.2,
            };
    }
}
