import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Assets } from "../../Constants/General";
import { UpdateCanvas } from '../../Redux/Actions/CanvasActions';
import { Upload } from 'antd';
import { Reset, Zoom } from '../../Redux/Actions/TransformationsActions';
import { SetCropping, UpdateWrapper } from '../../Redux/Actions/CropperActions';


function Header() {

    const dispatch = useDispatch();

    const canvas = useSelector((state) => state.Canvas)
    const { imageName, imageWidth, imageHeight, canvasWrapperRef, canvasRef } = canvas;

    const transformations = useSelector((state) => state.Transformations)
    const { positionX, positionY, scale } = transformations;

    const cropper = useSelector((state) => state.Cropper)
    const { cropping } = cropper;

    function zoomFunction(type) {

        //console.log("hi")
        let tempScale = type == "in" ? (scale + 0.1) : (scale - 0.1);

        let maxDim = Math.max(imageHeight, imageWidth);
        let canvasBounds = canvasRef.current.getBoundingClientRect();
        let wrapperBounds = canvasWrapperRef.current.getBoundingClientRect();

        let { x, y, width, height } = canvasBounds;
        //console.log(y, wrapperBounds.y)

        let widthOverhang = (imageWidth * tempScale - width) / 2;
        let heightOverhang = (imageHeight * tempScale - height) / 2;
        let relativeX = x - widthOverhang - wrapperBounds.x;
        let relativeY = y - wrapperBounds.y - heightOverhang;
        if (tempScale > (100 / maxDim) && tempScale < Math.round(20000 / maxDim)) {

            if (cropping) dispatch(SetCropping(false))

            dispatch(Zoom({
                positionX: positionX,
                positionY: positionY,
                scale: tempScale
            }))
            dispatch(UpdateWrapper(relativeX, relativeY, imageWidth * tempScale, imageHeight * tempScale))
            if (cropping) dispatch(SetCropping(true))
        }

    }

    //console.log(canvasWrapperRef)
    return (

        <div className="bg-dark-blue-2 w-full grid grid-cols-3 px-6 h-16" >
            <div className='flex content-center justify-start'>
                <img src={Assets.icons.message_question} className="self-center hover:opacity-80" />
            </div>
            <div className='flex items-center justify-center gap-5'>
                <div className='flex items-center justify-center gap-4'>
                    <img src={Assets.icons.search_zoom_out} onClick={() => zoomFunction("out")} className="self-center hover:opacity-80" />
                    <div className='text-sm text-white font-bold opacity-80 pt-1 '>{Math.round(scale * 100)}%</div>
                    <img src={Assets.icons.search_zoom_in} onClick={() => zoomFunction("in")} className="self-center hover:opacity-80" />
                </div>
                <div className='text-sm text-white font-semibold opacity-40 pt-1'>|</div>
                <div className='text-sm text-white opacity-80 pt-1.5' style={{ wordSpacing: "6px" }}>{`${Math.round(imageWidth)} x ${Math.round(imageHeight)} pixels`}</div>
            </div>
            <div className='flex content-center justify-end '>
                <img src={Assets.Ai_Powered} className="h-6 self-center" />
            </div>


        </div>
    );
}

export default Header;