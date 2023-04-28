import { CropperActionTypes as Cropper } from "../Constants/CropperActionTypes";


export const UpdateWrapper = (wrapperX, wrapperY, wrapperWidth, wrapperHeight) => {
    return ({
        type: Cropper.UPDATE_WRAP,
        payload: {
            wrapperX,
            wrapperY,
            wrapperWidth,
            wrapperHeight
        }
    })
}
export const SetCropping = (cropping) => {
    //console.log(cropping)
    return ({
        type: Cropper.CROPPING,
        payload: {
            cropping
        }
    })
}
export const SetCrop = (crop) => {
    //console.log(cropping)
    return ({
        type: Cropper.SETCROP,
        payload: crop
    })
}
export const SetCropValues = (cropValues) => {
    //console.log(cropping)
    return ({
        type: Cropper.SETCROPVALUES,
        payload: cropValues
    })
}