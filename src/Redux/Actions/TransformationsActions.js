import { TransformationsActionTypes as Transformations } from "../Constants/TransformationsActionTypes";


export const Move = ({positionX, positionY}) => {
    // console.log("dipatching", positionX, positionY)
    return ({
        type: Transformations.MOVE,
        payload: {
            positionX, 
            positionY
        }
    })
}
export const Zoom = ({positionX, positionY, scale}) => {
    // console.log("dipatching", positionX, positionY)
    return ({
        type: Transformations.ZOOM,
        payload: {
            scale,
            positionX, 
            positionY
        }
    })
}
export const Reset = () => {
    return ({
        type: Transformations.RESET,
        payload: {}
    })
}