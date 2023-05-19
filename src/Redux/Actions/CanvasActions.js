import { CanvasActionTypes } from "../Constants/CanvasActionTypes";
import init, { Canvas } from "wasm-lib";

export const CreateCanvas = (imageWidth, imageHeight, wrapperBounds) => {

    const canvasObj = new Canvas("canvas");

    //console.log("size", canvasObj.get_size())

    return ({
        type: CanvasActionTypes.CREATE,
        payload: {
            canvasObj,
            imageWidth,
            imageHeight,
            wrapperBounds,
            fileSize: canvasObj.get_size()/(1024*1024),
        }
    })
}
export const UpdateCanvas = (payload) => {

    return ({
        type: CanvasActionTypes.UPDATE,
        payload: payload,
    })
}
