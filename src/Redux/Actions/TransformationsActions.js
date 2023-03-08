import { TransformationsActionTypes as Transformations } from "../Constants/TransformationsActionTypes";

const canvas = document.getElementById("canvas");

export const Crop = ({startX,startY,width,height}) => {
    return ({
        type: Transformations.CROP,
        payload: {
            startX: startX,
            startY: startY,
            width: width,
            height: height,
        }
    })
}
export const initialCanvasState = ({canvasWidth, canvasHeight}) => {
    return ({
        type: Transformations.INITIAL,
        payload: {
            canvasWidth,
            canvasHeight,
        }
    })
}