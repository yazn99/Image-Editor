import { CropperActionTypes } from "../Constants/CropperActionTypes";

const cropperInitialState = {
    wrapperX: 0,
    wrapperY: 0,
    wrapperWidth: 0,
    wrapperHeight: 0,
    cropping: false,
    crop: {},
    cropValues: {},
    ratio: "2/1",
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

            let width= state.wrapperWidth;
            let height= state.wrapperHeight;

            let ratio= eval(state.ratio)
            
            if (state.ratio) {
                width = height * ratio < state.wrapperWidth? height * ratio : state.wrapperWidth;
                height = width / ratio < state.wrapperHeight ? width / ratio : state.wrapperHeight;

            }
            return {
                ...state,
                crop: { left: 0, top: 0, width, height },
                cropValues: { left: 0, top: 0, width, height },
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
        case CropperActionTypes.SETRATIO: {
            
            let width= state.wrapperWidth;
            let height= state.wrapperHeight;

            let ratio= eval(state.ratio)
            
            if (state.ratio) {
                width = height * ratio < state.wrapperWidth? height * ratio : state.wrapperWidth;
                height = width / ratio < state.wrapperHeight ? width / ratio : state.wrapperHeight;

            }
            return {
                ...state,
                crop: { left: 0, top: 0, width, height },
                cropValues: { left: 0, top: 0, width, height },
                ...payload,
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