import { CanvasActionTypes } from "../Constants/CanvasActionTypes";
import init, { Canvas } from "wasm-lib";

export const CreateCanvas = (imageWidth, imageHeight, wrapperBounds) => {

    const canvasObj = new Canvas("canvas");

    //console.log(imageWidth, imageHeight)

    return ({
        type: CanvasActionTypes.CREATE,
        payload: {
            canvasObj,
            imageWidth,
            imageHeight,
            wrapperBounds,
        }
    })
}
export const UpdateCanvas = (payload) => {

    return ({
        type: CanvasActionTypes.UPDATE,
        payload: payload,
    })
}
