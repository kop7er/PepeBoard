import { createCanvas } from "canvas";
import getBoardFont from "./font";
import getBoardImage from "./image";
import getBoardTextLocation from "./textLocation";

export default async function getBoard(boardText: string, boardType: BoardType) {
    const boardImage = await getBoardImage();

    const canvas = createCanvas(boardImage.width, boardImage.height);

    const textLocation = getBoardTextLocation(boardType, canvas);

    const ctx = canvas.getContext("2d");

    ctx.drawImage(boardImage, 0, 0, canvas.width, canvas.height);

    ctx.font = getBoardFont(boardType);

    ctx.fillStyle = "#000000";

    ctx.textAlign = "center";

    ctx.fillText(boardText, textLocation.x, textLocation.y);

    return canvas.toBuffer();
}
