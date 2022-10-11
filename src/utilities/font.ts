function getBoardFont(boardType: BoardType) {

    switch (boardType) {

        case "normal":

            return "26px Lato-Bold";

        case "minecraft":

            return "26px Minecraftia-Regular";

    }
    
}

export default getBoardFont;