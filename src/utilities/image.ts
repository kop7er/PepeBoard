import { loadImage } from "canvas";

import type { Image } from "canvas";

let boardImage: Image | null = null;

async function getBoardImage() {

    if (boardImage == null) {

        boardImage = await loadImage(process.env.BOARD_IMAGE_URL!);

    }

    return boardImage;

}

export default getBoardImage;