import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Assets } from "../../../Constants/General";
import { Slider, Input } from 'antd';
import { SetCropping, UpdateWrapper } from '../../../Redux/Actions/CropperActions';
import { Zoom } from '../../../Redux/Actions/TransformationsActions';
import { UpdateCanvas } from '../../../Redux/Actions/CanvasActions';


export const validNumber = new RegExp(
    '[0-9]*|null'
);

function CropperPanel() {

    
    const canvas = useSelector((state) => state.Canvas)
    const { canvasObj, imageWidth, imageHeight, canvasWrapperRef, canvasRef, alignment, fileSize } = canvas;

    const transformations = useSelector((state) => state.Transformations)
    const { positionX, positionY, scale } = transformations;

    const cropper = useSelector((state) => state.Cropper)
    const { cropping, crop, cropValues, ratio } = cropper;

    const [tempWidth, setTempWidth] = useState(imageWidth);
    const [tempHeight, setTempHeight] = useState(imageHeight);

    useEffect(() => {
        setTempHeight(imageHeight);
        setTempWidth(imageWidth);
    }, [imageHeight, imageWidth])

    useEffect(() => {
        dispatch(SetCropping(true))
        return () => {
            dispatch(SetCropping(false))
        }
    }, [])

    const dispatch = useDispatch();


    const LabeledInput = ({ label, value, onChange, onPressEnter }) => {
        return (
            <div className='flex justify-between items-center w-full'>
                <div className='text-sm text-white font-medium'>{label}:</div>
                <Input onPressEnter={onPressEnter} className='input-primary' value={value} onChange={onChange} />
            </div>
        )
    }
    const calculate_dimensions = (imageWidth, imageHeight, w, h) => {
        let ratio = imageWidth / imageHeight;
        let width = ratio * h;
        let height = w / ratio;
        return { width, height }
    }

    const setTempWidthWithVer = (value) => {
        if (validNumber.test(value)) {
            //console.log("valid")
            if (value >= 0 && value <= 20000) {
                setTempWidth(value);
                return value;
            }
            else {
                return tempWidth;
            }
        }
        else {
            return tempWidth;
        }
    }
    const setTempHeightWithVer = (value) => {
        if (validNumber.test(value)) {
            if (value >= 100 && value <= 20000) {
                setTempHeight(value);
                return value;
            }
            else {
                return tempHeight;
            }
        }
        else {
            return tempHeight;
        }
    }

    return (
        <div className=' flex flex-col justify-start gap-6 px-5 w-full h-full'>

            <div className=' flex flex-col gap-3.5 w-full h-[154px]'>
                {/* <div className='text-base text-light-accent font-semibold'>Resize</div> */}
                <div className=' flex flex-col gap-4 h-[42px] w-full relative'>
                    {
                        LabeledInput({
                            label: "Crop Width", value: Math.round(crop.width * 1 / scale),

                            //onPressEnter: (e) => { resizeFunction(setTempHeightWithVer(e.target.value), tempHeight); dispatch(UpdateWrapper(positionX, positionY, setTempHeightWithVer(e.target.value)), tempHeight) }
                        })
                    }
                    {
                        LabeledInput({
                            label: "Crop Height", value: Math.round(crop.height * 1 / scale),
                            //onPressEnter: (e) => { resizeFunction(tempWidth, setTempHeightWithVer(e.target.value)); dispatch(UpdateWrapper(positionX, positionY, tempWidth, setTempHeightWithVer(e.target.value))) }
                        })
                    }
                    {
                        LabeledInput({
                            label: "X", value: Math.round(crop.top * 1 / scale),
                            //onPressEnter: (e) => { resizeFunction(tempWidth, setTempHeightWithVer(e.target.value)); dispatch(UpdateWrapper(positionX, positionY, tempWidth, setTempHeightWithVer(e.target.value))) }
                        })
                    }
                    {
                        LabeledInput({
                            label: "Y", value: Math.round(crop.left * 1 / scale),
                            //onPressEnter: (e) => { resizeFunction(tempWidth, setTempHeightWithVer(e.target.value)); dispatch(UpdateWrapper(positionX, positionY, tempWidth, setTempHeightWithVer(e.target.value))) }
                        })
                    }
                </div>
            </div>
        </div>

    );
}

export default CropperPanel;

