 const HandlersStyles = {
    RU_Handler: {
        position: "absolute",
        right: -2,
        top: -2,
        cursor: "ne-resize"
    },
    RB_Handler: {
        position: "absolute",
        right: -2,
        bottom: -2,
        transform: "matrix(1, 0, 0, -1, 0, 0)",
        cursor: "se-resize"
    },
    LU_Handler: {
        position: "absolute",
        left: -2,
        top: -2,
        transform: "matrix(-1, 0, 0, 1, 0, 0)",
        cursor: "nw-resize"
    },
    LB_Handler: {
        position: "absolute",
        left: -2,
        bottom: -2,
        transform: "rotate(180deg)",
        cursor: "sw-resize"
    },
    CU_Handler: {
        position: "absolute",
        left: "50%",
        top:-2,
        transform: "translate(-50%, 0)",
        cursor: "n-resize"
    },
    CB_Handler: {
        position: "absolute",
        left: "50%",
        bottom:-2,
        transform: "translate(-50%, 0) matrix(1, 0, 0, -1, 0, 0)",
        cursor: "s-resize"
    },
    CL_Handler: {
        position: "absolute",
        left:-25.5,
        top: "50%",
        transform: " rotate(-90deg) translate(0, -50%)",
        cursor: "w-resize"
    },
    CR_Handler: {
        position: "absolute",
        right:-27,
        top: "50%",
        transform: "translate(0, -50%) rotate(90deg)",
        cursor: "e-resize"
    },

}
 
const GuideLinesStyles = {
    
    HU_Line: {
        position: "absolute",
        top: "33%",
        transform: "translate(0, -33%)",
        width: "100%",
        height: "0.8px",
        color :"rgba(222, 222, 222, 0.8)",
        background :"rgba(222, 222, 222, 0.8)",
        border:"none"
    },
    HB_Line: {
        position: "absolute",
        top: "66%",
        transform: "translate(0, -66%)",
        width: "100%",
        height: "0.8px",
        color :"rgba(222, 222, 222, 0.8)",
        background :"rgba(222, 222, 222, 0.8)",
        border:"none"
    },
    VL_Line: {
        position: "absolute",
        left: "33%",
        transform: "translate(-33%, 0)",
        height: "100%",
        width: "0.8px",
        color :"rgba(222, 222, 222, 0.8)",
        background :"rgba(222, 222, 222, 0.8)",
        border:"none"
        
    },
    VR_Line: {
        position: "absolute",
        left: "66%",
        transform: "translate(-66%, 0)",
        height: "100%",
        width: "0.8px",
        color :"rgba(222, 222, 222, 0.8)",
        background :"rgba(222, 222, 222, 0.8)",
        border:"none"
        
    },
}

 const GuideLinesWrapperStyles = {
    position: "relative", 
    height: "100%",
    width: "100%",
    cursor: "move",
}
 const CropHandlersStyles = {
    position: "relative",
    height: "100%",
    width: "100%"
}
 const CropSelectionStyles = {
    position:"absolute",
}
 const cropSelectionWrapperStyles = {
    position: "relative",
    width: "100%",
    height: "100%",
    overflow:"hidden",
}

export default{cropSelectionWrapperStyles, CropSelectionStyles, CropHandlersStyles, HandlersStyles, GuideLinesStyles, GuideLinesWrapperStyles}