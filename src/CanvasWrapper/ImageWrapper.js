import React, { useEffect, useState, useRef } from 'react';
import init, { Crop_Function } from "wasm-lib";
import test from '../test.jpg';
import "react-image-crop/dist/ReactCrop.css";
import ReactCrop, {
    centerCrop,
    makeAspectCrop,
    Crop,
    PixelCrop,
} from 'react-image-crop';
import 'react-advanced-cropper/dist/style.css'
import { useSelector } from 'react-redux'

function ImageWrapper({ parentWidth, parentHeight }) {

    const canvasState = useSelector((state) => state.Transformations);
    console.log(canvasState)

    const canvasRef = useRef(null);

    const [crop, setCrop] = useState(
        {
            unit: 'px',
            width: 0,
            height: 0,
            x: 0,
            y: 0
        }
    );

    useEffect(() => {
        init().then(() => {
            if (parentHeight > 1 && parentWidth > 1) {
                //console.log(parentWidth, parentHeight)
                ResizeCanvas(parentWidth, parentHeight)
                //alterRed("canvas", 250);
            }
        });

    }, [parentWidth, parentHeight])

    const ResizeCanvas = (parentWidth, parentHeight) => {
        // const canvas = document.getElementById("canvas");
        // var hRatio = parentWidth / img.width;
        // var vRatio = parentHeight / img.height;
        // var ratio = Math.min(hRatio, vRatio);
        // //set the canvas size same as the image size
        // canvas.width = img.width * ratio;
        // canvas.height = img.height * ratio;

    }

    // return (
    //     <ReactCrop crop={crop} onChange={cropObj => setCrop(cropObj)}
    //         onComplete={cropObj => Crop_Function("canvas", cropObj.x, cropObj.y, cropObj.width, cropObj.height)}  >
    //         <canvas id="canvas" />
    //     </ReactCrop>
    // );
    return (
        <ReactCrop crop={crop} onChange={cropObj => setCrop(cropObj)}
            onComplete={cropObj => {
                Crop_Function("canvas", cropObj.x, cropObj.y, cropObj.width, cropObj.height);
                setCrop({
                    unit: 'px',
                    width: cropObj.width-20,
                    height: cropObj.height-20,
                    x: 10,
                    y: 10
                })
            }} >
            <canvas ref={canvasRef} id="canvas" />
        </ReactCrop>
    );
}
export default ImageWrapper;