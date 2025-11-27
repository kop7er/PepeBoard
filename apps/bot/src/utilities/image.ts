import { type Image, loadImage } from "canvas";

let cachedBoardImage: Image | null = null;

export async function loadBoardImage(): Promise<Image> {
    cachedBoardImage ??= await loadImage(process.env.BOARD_IMAGE_URL);
    return cachedBoardImage;
}
