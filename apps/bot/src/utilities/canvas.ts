import { createCanvas } from "canvas";
import type { BoardType } from "../types/global.js";
import { getBoardFont } from "./font.js";
import { loadBoardImage } from "./image.js";
import { getBoardTextLocation } from "./textLocation.js";

export async function createBoard(boardText: string, boardType: BoardType): Promise<Buffer> {
    const boardImage = await loadBoardImage();

    const canvas = createCanvas(boardImage.width, boardImage.height);
    const ctx = canvas.getContext("2d");
    const textLocation = getBoardTextLocation(boardType, canvas);

    ctx.drawImage(boardImage, 0, 0, canvas.width, canvas.height);
    ctx.font = getBoardFont(boardType);
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.fillText(boardText, textLocation.x, textLocation.y);

    return canvas.toBuffer();
}
