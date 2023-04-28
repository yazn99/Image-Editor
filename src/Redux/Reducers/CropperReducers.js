import { CropperActionTypes } from "../Constants/CropperActionTypes";

const cropperInitialState = {
    wrapperX: 0,
    wrapperY: 0,
    wrapperWidth: 0,
    wrapperHeight: 0,
    cropping: false,
    crop: {},
    cropValues: {},
}
export const CropperReducers = (state = cropperInitialState, { type, payload }) => {
    switch (type) {
        case CropperActionTypes.UPDATE_WRAP: {
            return {
                ...state,
                ...payload,
            }
        }
        case CropperActionTypes.CROPPING: {
            return {
                ...state,
                crop: { left: 1, top: 0, width: state.wrapperWidth / 2, height: state.wrapperHeight / 2 },
                cropValues: { left: 1, top: 0, width: state.wrapperWidth / 2, height: state.wrapperHeight / 2 },
                ...payload,
            }
        }
        case CropperActionTypes.SETCROP: {
            return {
                ...state,
                crop: payload,
            }
        }
        case CropperActionTypes.SETCROPVALUES: {
            return {
                ...state,
                cropValues: payload,
            }
        }
        case CropperActionTypes.CROP: {

            const { startX, startY, width, height } = payload;
            //console.log(payload)

            if (state.CanvasLoaded) {
                state.canvasObj.crop_function(startX, startY, width, height);
            }
            return {
                ...state,
            }
        }
        default:
            return state;
    }
}