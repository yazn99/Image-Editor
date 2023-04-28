import { CanvasActionTypes } from "../Constants/CanvasActionTypes";

const cavnasInitialState = {
    canvasCreated: false,
    canvasObj: null,
    imageWidth: null,
    imageHeight: null,
    scaleRatio: null,
    positionX: 0,
    PositionY: 0,
    imageObj: new Image(),
}
export const CanvasReducers = (state = cavnasInitialState, { type, payload }) => {
    switch (type) {
        case CanvasActionTypes.CREATE: {
            return {
                ...state,
                ...payload,
                canvasCreated: true,
            }
        }
        case CanvasActionTypes.UPDATE: {
            return {
                ...state,
                ...payload,
            }
        }
        // case TransformationsActionTypes.CROP: {

        //     const {startX, startY, width, height}= payload;

        //     if(state.CanvasLoaded){
        //         state.canvasObj.crop_function(startX, startY, width, height);
        //     }
        //     return {
        //         ...state,
        //         ...payload,
        //         CanvasLoaded: true,
        //     }
        // }
        default:
            return state;
    }
}