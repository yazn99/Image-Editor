import { TransformationsActionTypes } from "../Constants/TransformationsActionTypes";

const cavnasInitialState = {
    CanvasLoaded: false,
    canvasWidth: 900,
    canvasHeight: 800,
}
export const TransformationsReducers = (state = cavnasInitialState, { type, payload }) => {
    switch (type) {
        case TransformationsActionTypes.INITIAL: {
            //console.log("redux initial request:", payload)
            return {
                ...state,
                ...payload,
                CanvasLoaded: true,
            }
        }
        default:
            return state;
    }
}