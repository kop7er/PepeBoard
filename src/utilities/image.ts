import { loadImage, type Image } from "canvas";

let boardImage: Image | null = null;

export default async function getBoardImage() {

    if (boardImage == null) {

        boardImage = await loadImage(process.env.BOARD_IMAGE_URL!);

    }

    return boardImage;

}
