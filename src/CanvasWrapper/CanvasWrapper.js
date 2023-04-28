import React, { useEffect, useState, useRef } from 'react';
import Cropper from '../Components/Cropper/Cropper';
import { useDispatch, useSelector } from 'react-redux'
import { useGesture } from 'react-use-gesture';
import { Move, Zoom } from '../Redux/Actions/TransformationsActions';
import { SetCropping, UpdateWrapper } from '../Redux/Actions/CropperActions';
import Canvas from '../Components/Canvas';
import init from "wasm-lib";
import { CreateCanvas, UpdateCanvas } from '../Redux/Actions/CanvasActions';
import test from '../test.jpg';

 
function CanvasWrapper() {

    const [transforming, setTransforming] = useState(false);

    const canvasWrapperRef = useRef();
    const canvasRef = useRef();
    //const cropperRef = useRef();

    const canvasState = useSelector((state) => state.Canvas)
    const { canvasCreated, imageWidth, imageHeight, canvasObj, imageObj } = canvasState;

    const cropper = useSelector((state) => state.Cropper)
    const { cropping } = cropper;

    const transformations = useSelector((state) => state.Transformations)
    const { positionX, positionY, scale } = transformations;

    const dispatch = useDispatch();


    useEffect(() => {
        init().then(() => {

                const canvas = document.getElementById("hidden_canvas");

                //console.log(canvas.width)
                const ctx = canvas.getContext("2d");
                canvas.width = imageObj.width;
                canvas.height = imageObj.height;

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(imageObj, 0, 0, imageObj.width, imageObj.height);

                //create main canvas
                let wrapperBounds = canvasWrapperRef.current.getBoundingClientRect();

                dispatch(CreateCanvas(imageObj.width, imageObj.height));
                fitToWrapper(imageObj.width, imageObj.height)


        });

    }, [imageObj])

    const fitToWrapper = (imageWidth, imageHeight) => {
        
        let wrapperBounds = canvasWrapperRef.current.getBoundingClientRect();

        let h_ratio = wrapperBounds.width / imageWidth;
        let v_ratio = wrapperBounds.height / imageHeight;

        let ratio = Math.min(h_ratio, v_ratio);

        //calculating centering shift values
        let center_shift_x = (wrapperBounds.width - imageWidth * ratio) / 2.00;
        let center_shift_y = (wrapperBounds.height - imageHeight * ratio) / 2.00;

        let originalWidth = canvasRef.current.clientWidth;
        let widthOverhang = (imageWidth * ratio - originalWidth) / 2;

        let originalHeight = canvasRef.current.clientHeight;
        let heightOverhang = (imageHeight * ratio - originalHeight) / 2;

        dispatch(Zoom({
            positionX: center_shift_x + widthOverhang,
            positionY: center_shift_y + heightOverhang,
            scale: ratio,
        }))
        dispatch(UpdateWrapper(center_shift_x, center_shift_y, originalWidth * ratio, originalHeight * ratio))
        //console.log(widthOverhang)
}
    useEffect(() => {
        window.addEventListener('keydown', handleSpaceDown);
        window.addEventListener('keydown', handleCDown);
        window.addEventListener('keydown', handleCtrl_ZeroDown);
        return () => {
            window.removeEventListener('keydown', handleSpaceDown);
            window.removeEventListener('keydown', handleCDown);
            window.removeEventListener('keydown', handleCtrl_ZeroDown);
        }
    }, [])

    useEffect(() => {
        window.addEventListener('keydown', handleCtrl_ZeroDown);
        return () => {
            window.removeEventListener('keydown', handleCtrl_ZeroDown);
        }
    }, [imageWidth, imageHeight, cropping])

    const handleSpaceDown = (e) => {
        if (e.key == " " ||
            e.code == "Space" ||
            e.keyCode == 32) {
            dispatch(SetCropping(false));
        }
    }
    const handleCDown = (e) => {
        if (e.code == "KeyC") {
            dispatch(SetCropping(true));
        }
    }
    const handleCtrl_ZeroDown = (e) => {
        if (e.key == "0" && e.ctrlKey == true && !cropping) {
            fitToWrapper(imageWidth, imageHeight)
        }
    }


    const updateCropperState = (operation, positionX, positionY) => {

        let canvasBounds = canvasRef.current.getBoundingClientRect();
        let wrapperBounds = canvasWrapperRef.current.getBoundingClientRect();

        let originalWidth = canvasRef.current.clientWidth;
        let widthOverhang = (canvasBounds.width - originalWidth) / 2;

        let originalHeight = canvasRef.current.clientHeight;
        let heightOverhang = (canvasBounds.height - originalHeight) / 2;

        let { x, y, width, height } = canvasBounds;
        //console.log(positionX, positionY)

        if (operation == "dragging") {
            //console.log(positionX)
            if (x !== positionX) {
                x = positionX - widthOverhang;
            }
            if (y !== positionY) {
                y = positionY - heightOverhang;
            }
        }


        dispatch(UpdateWrapper(x, y, width, height))
        // console.log(x, y)
        // console.log(widthOverhang, heightOverhang)

    }
    const checkBoundries = (positionX, positionY, scale) => {
        //console.log("hi")
        const newCoord = {
            positionX: positionX, positionY: positionY
        }
        let canvasBounds = canvasRef.current.getBoundingClientRect();
        let wrapperBounds = canvasWrapperRef.current.getBoundingClientRect();

        let widthDifference = Math.abs(wrapperBounds.width - canvasBounds.width);
        let originalWidth = canvasRef.current.clientWidth;
        let widthOverhang = (canvasBounds.width - originalWidth) / 2;

        let heightDifference = Math.abs(wrapperBounds.height - canvasBounds.height);
        let originalHeight = canvasRef.current.clientHeight;
        let heightOverhang = (canvasBounds.height - originalHeight) / 2;

        //console.log(heightOverhang)

        if (wrapperBounds.width - canvasBounds.width > 0) {
            if (canvasBounds.left < wrapperBounds.left) {
                newCoord.positionX = widthOverhang;
            }
            else if (canvasBounds.right > wrapperBounds.right) {
                newCoord.positionX = widthDifference + widthOverhang;
            }
        }
        else {
            if (canvasBounds.left < (wrapperBounds.left - widthDifference)) {
                newCoord.positionX = -(widthDifference - widthOverhang);
            }
            else if (canvasBounds.right > (wrapperBounds.right + widthDifference)) {
                newCoord.positionX = widthOverhang;
            }
        }
        if (wrapperBounds.height - canvasBounds.height > 0) {
            if (canvasBounds.top < wrapperBounds.top) {
                newCoord.positionY = heightOverhang;
            }
            else if (canvasBounds.bottom > wrapperBounds.bottom) {
                newCoord.positionY = heightDifference + heightOverhang;
            }
        }
        else {
            if (canvasBounds.top < (wrapperBounds.top - heightDifference)) {
                newCoord.positionY = -(heightDifference - heightOverhang);
            }
            else if (canvasBounds.bottom > (wrapperBounds.bottom + heightDifference)) {
                newCoord.positionY = heightOverhang;
            }
        }

        dispatch(Move(newCoord))
        updateCropperState("dragging", newCoord.positionX, newCoord.positionY);

    }

    useGesture({
        onWheel: ({ memo, event, last, first, distance, ...rest }) => {

            memo ??= {
                bounds: canvasRef.current.getBoundingClientRect(),
                canvasState: { positionX, positionY, scale }
            };


            if (last) return // event can be undefined as the last event is debounced
            //console.log(memo)
            event.preventDefault() // this is needed to prevent the native browser scroll

            let transformOriginX = memo.bounds.x + memo.bounds.width / 2;
            let transformOriginY = memo.bounds.y + memo.bounds.height / 2;
            let displacementX = (transformOriginX - event.clientX) / memo.canvasState.scale;
            let displacementY = (transformOriginY - event.clientY) / memo.canvasState.scale;
            //console.log(distance)

            let delta = (event.wheelDelta ? event.wheelDelta : -event.deltaY);
            let tempScale = (delta > 0) ? (scale + 0.1) : (scale - 0.1);

            //console.log(delta)
            let d = (delta > 0) ? (0.1) : (-0.1);

            let maxDim= Math.max(imageHeight, imageWidth);

            if (tempScale > (100/maxDim) && tempScale < Math.round(20000/maxDim)) {
                dispatch(Zoom({
                    positionX: memo.canvasState.positionX + displacementX * d,
                    positionY: memo.canvasState.positionY + displacementY * d,
                    scale: tempScale
                }))
            }


        },
        onDrag: ({ movement: [dx, dy] }) => {
            dispatch(Move({ positionX: dx, positionY: dy }))
        },
        onDragStart: () => {
            setTransforming(true)
        },
        onDragEnd: () => {
            checkBoundries(positionX, positionY, scale);
            setTransforming(false)
        },
        onWheelStart: () => {
            setTransforming(true)
        },
        onWheelEnd: () => {
            updateCropperState()
            setTransforming(false)
        }
    }, {
        drag: {
            initial: () => [positionX, positionY]
        },
        domTarget: canvasRef,
        eventOptions: { passive: false },
    })

    // let cropperBounds = cropperRef.current.getBoundingClientRect();
    //console.log("wrapper",positionX, positionY)

    return (
        <div style={{
            position: "relative",
            overflow: "hidden",
            width: "100%",
            height: "100%",
            background: "#081925",
        }} ref={canvasWrapperRef} >


            <div ref={canvasRef} style={{
                position: "absolute",
                left: positionX,
                top: positionY,
                transform: `scale(${scale})`
            }} >
                <Canvas />
            </div>
            {
                cropping && !transforming && <Cropper canvasRef={canvasRef} />
            }
        </div>

    );
}
export default CanvasWrapper;