import type { Canvas } from "canvas";

function getBoardTextLocation(boardType: BoardType, canvas: Canvas) {

    switch (boardType) {

        case "normal":

            return { 
                
                x: canvas.width / 2.0, 

                y: canvas.height / 3.4
            
            };


        case "minecraft":

            return { 
                
                x: canvas.width / 2.0, 
                
                y: canvas.height / 2.2
            
            };

    }
    
}

export default getBoardTextLocation;