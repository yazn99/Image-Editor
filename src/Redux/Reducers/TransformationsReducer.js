import { TransformationsActionTypes } from "../Constants/TransformationsActionTypes";

const cavnasInitialState = {
    scale: 1,
    positionX: 0,
    positionY: 0,
    cropping: false,
}
export const TransformationsReducers = (state = cavnasInitialState, { type, payload }) => {
    switch (type) {
        case TransformationsActionTypes.MOVE: {
            const { positionX, positionY } = payload;
            return {
                ...state,
                positionX,
                positionY,
            }
        }
        case TransformationsActionTypes.ZOOM: {
            const { positionX, positionY, scale } = payload;
            //console.log(finalScale)
            return {
                ...state,
                scale,
                positionX,
                positionY,
            }
        }
        case TransformationsActionTypes.RESET: {
            //console.log(finalScale)
            return {
                scale: 1,
                positionX: 0,
                positionY: 0,
                cropping: false,
            }
        }
        default:
            return state;
    }
}