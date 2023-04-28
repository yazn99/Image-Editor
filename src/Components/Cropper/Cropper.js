import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { SetCrop, SetCropValues, UpdateWrapper } from '../../Redux/Actions/CropperActions';
import { useGesture } from 'react-use-gesture';
import "./CropperStyles/Cropper.css"
import { Handlers, CropperStyles } from "../../Constants/Cropper"
import { Move } from '../../Redux/Actions/TransformationsActions';
import { UpdateCanvas } from '../../Redux/Actions/CanvasActions';

function Cropper({ canvasRef }) {
    const dispatch = useDispatch();
    const cropSelectionRef = useRef();
    const cropSelectionWrapperRef = useRef();

    const canvas = useSelector((state) => state.Canvas)
    const { CanvasCreated, canvasObj } = canvas;

    const cropper = useSelector((state) => state.Cropper)
    const { wrapperX, wrapperY, wrapperWidth, wrapperHeight, cropping, crop, cropValues } = cropper;

    const transformations = useSelector((state) => state.Transformations)
    const { positionX, positionY, scale } = transformations;

    // const [cropValues, setCropValues] = useState({
    //     left: 1, top: 0, width: wrapperWidth / 2, height: wrapperHeight / 2
    // });
    // const [crop, setCrop] = useState({
    //     left: 1, top: 0, width: wrapperWidth / 2, height: wrapperHeight / 2
    // });

    const { cropSelectionWrapperStyles, CropSelectionStyles,
        CropHandlersStyles, HandlersStyles, GuideLinesStyles, GuideLinesWrapperStyles } = CropperStyles;

    const setCrop = (crop) => {
        dispatch(SetCrop(crop))
    }
    const setCropValues = (crop) => {
        dispatch(SetCropValues(crop))
    }

    const handleEnterDown = (e) => {
        if (e.code == "Enter" && cropping) {
            cropFunction(cropValues);
        }
    }


    useEffect(() => {
        window.addEventListener('keydown', handleEnterDown);
        return () => {
            window.removeEventListener('keydown', handleEnterDown);
        }
    }, [cropValues])


    const cropFunction = () => {
        const { left, top, width, height } = cropValues;

        const realX = left * (1 / scale);
        const realY = top * (1 / scale);
        const realWidth = width * (1 / scale);
        const realHeight = height * (1 / scale);

        //calculate new positions
        let canvasBounds = canvasRef.current.getBoundingClientRect();

        let widthOverhang = (realWidth - width) / 2;

        let heightOverhang = (realHeight - height) / 2;

        //console.log(canvasBounds.left)

        let newWrapperCoord = {
            positionX: canvasBounds.left + left - widthOverhang,
            positionY: canvasBounds.top + top - heightOverhang,
        }


        canvasObj.crop_function(realX, realY, realWidth, realHeight);

        dispatch(UpdateCanvas({
            imageWidth: realHeight,
            imageHeight: realHeight
        }))

        dispatch(Move({ ...newWrapperCoord }))

        dispatch(UpdateWrapper(canvasBounds.left + left, canvasBounds.top + top, width, height))

        let newCoord = {
            width: width - 1.8,
            height: height - 1.8,
            top: 0,
            left: 0,
        };
        setCrop(newCoord)
        setCropValues(newCoord)

    }
    //console.log(canvasRef)

    const selectionBind = useGesture(
        {
            onDrag: ({ memo, args: [activeHandler], movement: [dx, dy], xy: [x, y], cancel, ...rest }) => {

                rest.event.preventDefault();

                memo ??= {
                    bounds: cropValues
                };

                let { left, top, width, height } = memo.bounds;

                //console.log(x - wrapperX)
                if (x - wrapperX < 0) cancel();

                setCrop({
                    ...crop,
                    top: top + dy,
                    left: left + dx
                })

            },
            onDragEnd: ({ movement: [mx, my], direction: [dx, dy], ...rest }) => {
                setCropValues({ ...crop })
            },
        },
        {
            drag: {
                bounds: ({ memo, ...rest }) => {

                    memo ??= {
                        bounds: cropValues,
                    };
                    let { left, top, width, height } = memo.bounds;

                    //console.log(memo)
                    return { left: -left, right: wrapperWidth - (width + left) - 1, top: -top, bottom: wrapperHeight - (top + height) - 1 }
                },
                initial: () => { return [0, 0] },
            }
        }
    )
    const bind = useGesture(
        {
            onDrag: ({ args: [activeHandler], movement: [mx, my], direction: [dx, dy], ...rest }) => {
                rest.event.preventDefault();

                let cropSelectionBounds = cropSelectionRef.current.getBoundingClientRect();
                let relativeBounds = {
                    x: Math.round(cropSelectionBounds.x - wrapperX),
                    y: cropSelectionBounds.y - wrapperY,
                    width: cropSelectionBounds.width,
                    height: cropSelectionBounds.height,
                }
                //let widthOverhang= wrapperWidth- selectioBounds.width;
                let heightOverhang = wrapperHeight - relativeBounds.height;

                //console.log("selectionBounds",cropSelectionBounds)
                //0console.log("relativeBounds",relativeBounds)
                if (activeHandler === "RU") {
                    //console.log(my)
                    let newCrop = {
                        ...crop,
                        width: cropValues.width + mx,
                        height: cropValues.height - my,
                        top: cropValues.top + my
                    }
                    setCrop(newCrop)
                    //console.log(wrapperHeight - (my + (heightOverhang - selectioBounds.y)))
                }
                else if (activeHandler === "RB") {
                    //console.log(mx, my)
                    let newCrop = {
                        ...crop,
                        width: cropValues.width + mx,
                        height: cropValues.height + my,

                    }
                    setCrop(newCrop)
                }
                else if (activeHandler === "LB") {
                    //console.log(mx, my)
                    let newCrop = {
                        ...crop,
                        width: cropValues.width - mx,
                        height: cropValues.height + my,
                        left: cropValues.left + mx
                    }
                    setCrop(newCrop)
                }
                else if (activeHandler === "LU") {
                    //console.log(mx, my)
                    let newCrop = {
                        ...crop,
                        width: cropValues.width - mx,
                        height: cropValues.height - my,
                        top: cropValues.top + my,
                        left: cropValues.left + mx
                    }
                    setCrop(newCrop)
                }
                else if (activeHandler === "CU") {
                    //console.log(my)
                    let newCrop = {
                        ...crop,
                        height: cropValues.height - my,
                        top: cropValues.top + my
                    }
                    setCrop(newCrop)
                    //console.log(wrapperHeight - (my + (heightOverhang - selectioBounds.y)))
                }
                else if (activeHandler === "CB") {
                    //console.log(mx, my)
                    let newCrop = {
                        ...crop,
                        height: cropValues.height + my,

                    }
                    setCrop(newCrop)
                }
                else if (activeHandler === "CL") {
                    //console.log(mx, my)
                    let newCrop = {
                        ...crop,
                        width: cropValues.width - mx,
                        left: cropValues.left + mx
                    }
                    setCrop(newCrop)
                }
                else if (activeHandler === "CR") {
                    //console.log(mx, my)
                    let newCrop = {
                        ...crop,
                        width: cropValues.width + mx,
                    }
                    setCrop(newCrop)
                }

            },
            onDragEnd: ({ args: [activeHandler], movement: [mx, my], direction: [dx, dy], ...rest }) => {
                //console.log(crop)
                setCropValues({ ...crop })
            },
        },
        {
            drag: {
                // bounds: { left: 0, right: wrapperWidth-2, top: 0, bottom: wrapperHeight -2 },
                initial: () => { return [0, 0] },
                bounds: ({ args: [activeHandler] }) => {
                    let cropSelectionBounds = cropSelectionRef.current.getBoundingClientRect();
                    let cropSelectionWrapperBounds = cropSelectionWrapperRef.current.getBoundingClientRect();

                    let leftBound = cropSelectionWrapperBounds.left - cropSelectionBounds.left;
                    let rightBound = cropSelectionWrapperBounds.right - cropSelectionBounds.right;
                    let topBound = cropSelectionWrapperBounds.top - cropSelectionBounds.top;
                    let bottomBound = cropSelectionWrapperBounds.bottom - cropSelectionBounds.bottom;
                    let widthBound = cropSelectionBounds.width - 50;
                    let heightBound = cropSelectionBounds.height - 50;
                    //console.log(activeHandler)
                    if (activeHandler === "LU") {
                        return { left: leftBound, right: widthBound, top: topBound, bottom: heightBound }
                    }
                    else if (activeHandler === "LB") {
                        return { left: leftBound, right: widthBound, top: -heightBound, bottom: bottomBound }
                    }
                    else if (activeHandler === "RB") {
                        return { left: -widthBound, right: rightBound, top: -heightBound, bottom: bottomBound }
                    }
                    else if (activeHandler === "RU") {
                        return { left: -widthBound, right: rightBound, top: topBound, bottom: heightBound }
                    }
                    else if (activeHandler === "CU") {
                        return { left: 0, right: 0, top: topBound, bottom: heightBound }
                    }
                    else if (activeHandler === "CB") {
                        return { left: 0, right: 0, top: -heightBound, bottom: bottomBound }
                    }
                    else if (activeHandler === "CR") {
                        return { left: -widthBound, right: rightBound - 1, top: 0, bottom: 0 }
                    }
                    else if (activeHandler === "CL") {
                        return { left: leftBound + 1, right: widthBound, top: 0, bottom: 0 }
                    }

                    //return{ left: left, right: 100, top: -50, bottom: 50 }
                }

            }
        }
    )

    //console.log(crop)
    return (
        <div ref={cropSelectionWrapperRef} className='cropWrapper' style={{
            left: wrapperX,
            top: wrapperY,
            width: wrapperWidth,
            height: wrapperHeight,
        }}>
            <div className='cropSelectionWrapper' style={cropSelectionWrapperStyles}>
                <div ref={cropSelectionRef} className='cropSelection' style={{
                    ...CropSelectionStyles,
                    ...crop,
                }} >
                    <div className='cropHandlers' style={CropHandlersStyles}>
                        {/* corner Handlers */}
                        <img {...bind("RU")} src={Handlers.Corner_Handler} style={HandlersStyles.RU_Handler} />
                        <img {...bind("RB")} src={Handlers.Corner_Handler} style={HandlersStyles.RB_Handler} />
                        <img {...bind("LU")} src={Handlers.Corner_Handler} style={HandlersStyles.LU_Handler} />
                        <img {...bind("LB")} src={Handlers.Corner_Handler} style={HandlersStyles.LB_Handler} />
                        {/* Border Handlers */}
                        {(crop.width > 200) && <img {...bind("CU")} src={Handlers.Border_Handler} style={HandlersStyles.CU_Handler} />}
                        {(crop.width > 200) && <img {...bind("CB")} src={Handlers.Border_Handler} style={HandlersStyles.CB_Handler} />}
                        {(crop.height > 200) && <img {...bind("CL")} src={Handlers.Border_Handler} style={HandlersStyles.CL_Handler} />}
                        {(crop.height > 200) && <img {...bind("CR")} src={Handlers.Border_Handler} style={HandlersStyles.CR_Handler} />}
                        {/* Line Guidelines */}
                        {<div {...selectionBind()} className='ruleOfThirds' style={GuideLinesWrapperStyles}>
                            <div src={Handlers.Line_Guideline} style={GuideLinesStyles.HU_Line} />
                            <div src={Handlers.Line_Guideline} style={GuideLinesStyles.HB_Line} />
                            <div src={Handlers.Line_Guideline} style={GuideLinesStyles.VL_Line} />
                            <div src={Handlers.Line_Guideline} style={GuideLinesStyles.VR_Line} />
                        </div>}

                    </div>
                </div>
            </div>

        </div>

    )
}

export default Cropper;