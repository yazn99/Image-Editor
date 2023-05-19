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

function CanvasPanel() {

    const [linkWH, setLinkWH] = useState(true);

    const [wrapperCoordinates, setWrapperCoordinates] = useState({
        x: 0,
        y: 0,
    });

    const canvas = useSelector((state) => state.Canvas)
    const { canvasObj, imageWidth, imageHeight, canvasWrapperRef, canvasRef, alignment, fileSize } = canvas;

    const transformations = useSelector((state) => state.Transformations)
    const { positionX, positionY, scale } = transformations;

    const cropper = useSelector((state) => state.Cropper)
    const { cropping } = cropper;

    const [tempWidth, setTempWidth] = useState(imageWidth);
    const [tempHeight, setTempHeight] = useState(imageHeight);
    useEffect(() => {
        setTempHeight(imageHeight);
        setTempWidth(imageWidth);
    }, [imageHeight, imageWidth])

    const dispatch = useDispatch();
    useEffect(() => {
        if (canvasWrapperRef) {
            if (canvasWrapperRef.current) {
                let wrapperBounds = canvasWrapperRef.current.getBoundingClientRect();

                let widthOverhang = (imageWidth * (scale - 1) / 2);

                let heightOverhang = (imageHeight * (scale - 1) / 2);

                setWrapperCoordinates({
                    x: wrapperBounds.x,
                    y: wrapperBounds.y,
                })
            }
        }

    }, [canvasWrapperRef])

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
    const InfoComponent = ({ label, value, metric, style }) => {
        return (
            <div style={style} className='flex justify-between w-full'>
                <div className='text-sm text-white font-medium'>{label}:</div>
                <div className='text-sm text-white font-semibold opacity-80'>{`${value} ${metric ? metric : ""}`}</div>
            </div>
        )
    }
    const fitToWrapper = (imageWidth, imageHeight) => {

        let wrapperBounds = canvasWrapperRef.current.getBoundingClientRect();

        let h_ratio = wrapperBounds.width / imageWidth;
        let v_ratio = wrapperBounds.height / imageHeight;

        let ratio = Math.min(h_ratio, v_ratio);

        let shift_x = (wrapperBounds.width - imageWidth * ratio) / 2.00;
        let shift_y = (wrapperBounds.height - imageHeight * ratio) / 2.00;
        let positionX;
        let positionY;

        let originalWidth = canvasRef.current.clientWidth;
        let widthOverhang = (imageWidth * ratio - originalWidth) / 2;

        let originalHeight = canvasRef.current.clientHeight;
        let heightOverhang = (imageHeight * ratio - originalHeight) / 2;


        dispatch(Zoom({
            positionX: shift_x + widthOverhang,
            positionY: shift_y + heightOverhang,
            scale: ratio,
        }))
        dispatch(UpdateWrapper(shift_x, shift_y, originalWidth * ratio, originalHeight * ratio))
    }

    const alignFunction = (imageWidth, imageHeight, id) => {

        let wrapperBounds = canvasWrapperRef.current.getBoundingClientRect();

        let shift_x = (wrapperBounds.width - imageWidth * scale) / 2.00;
        let shift_y = (wrapperBounds.height - imageHeight * scale) / 2.00;
        let positionX;
        let positionY;

        let originalWidth = canvasRef.current.clientWidth;
        let widthOverhang = (imageWidth * scale - originalWidth) / 2;

        let originalHeight = canvasRef.current.clientHeight;
        let heightOverhang = (imageHeight * scale - originalHeight) / 2;

        if (id == "c") {
            shift_x = (wrapperBounds.width - imageWidth * scale) / 2.00;
        } else if (id == "r") {
            shift_x = (wrapperBounds.width - imageWidth * scale);
        } else if (id == "l") {
            shift_x = 0;
        }
        else if (id == "t") {
            shift_y = 0;
        }
        else if (id == "b") {
            shift_y = (wrapperBounds.height - imageHeight * scale);
        }


        dispatch(Zoom({
            positionX: shift_x + widthOverhang,
            positionY: shift_y + heightOverhang,
            scale: scale,
        }))
        dispatch(UpdateWrapper(shift_x, shift_y, originalWidth * scale, originalHeight * scale))
    }

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

    const FlipRotateButton = ({ icon, id, onClick }) => {
        return (
            <div onClick={() => { onClick(); canvasObj.apply_changes() }} className={` transition ease-in-out duration-300 rounded-md flex justify-center 
            w-full h-full cursor-inherit hover:opacity-80 cursor-pointer bg-[#263B49]`}>
                <img src={icon} className="w-[24px]" />
            </div>
        )
    }
    const AlignmentButton = ({ icon, id }) => {
        return (
            <div onClick={() => {
                dispatch(UpdateCanvas({
                    alignment: id
                }));
                alignFunction(imageWidth, imageHeight, id)
            }} className={` transition ease-in-out duration-300 rounded-md flex justify-center 
            w-full h-full cursor-inherit  ${id == alignment ? "bg-[#26485B] " : "hover:opacity-80 cursor-pointer bg-[#263B49]"}`}>
                <img src={icon} className="w-[24px]" />
            </div>
        )
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
    const resizeFunction = (width, height) => {
        //console.log(width, imageWidth)

        let widthScale = (imageWidth / width) * scale;
        let heightScale = (imageHeight / height) * scale;

        let newScale = Math.min(widthScale, heightScale)
        dispatch(UpdateCanvas({
            imageHeight: height,
            imageWidth: width,
            fileSize: width * height * 3 / 8 / (1024 * 1024)
        }))

        canvasObj.resize_function(width, height, "");

        //console.log(Math.round(newScale * 100))

        dispatch(Zoom({
            positionX: positionX + ((imageWidth / 2) - (width / 2)),
            positionY: positionY + ((imageHeight / 2) - (height / 2)),
            scale: newScale,
        }))
    }
    const rotateFunction = (width, height, clockwise) => {
        //console.log(width, imageWidth)

        dispatch(UpdateCanvas({
            imageHeight: height,
            imageWidth: width,
            fileSize: width * height * 3 / 8 / (1024 * 1024)
        }))

        canvasObj.rotate_function(clockwise);

        //console.log(Math.round(newScale * 100))
        dispatch(UpdateWrapper(positionX + ((imageWidth / 2) - (width / 2)),
            positionY + ((imageHeight / 2) - (height / 2)),
            imageWidth * scale, imageHeight * scale))

        dispatch(Zoom({
            positionX: positionX + ((imageWidth / 2) - (width / 2)),
            positionY: positionY + ((imageHeight / 2) - (height / 2)),
            scale: scale,
        }))
    }
    return (
        <div className=' flex flex-col justify-start gap-6 px-5 w-full h-full'>
            <div className=' flex flex-col gap-3.5 w-full'>
                <div className='text-base text-light-accent font-semibold'>Navigation</div>
                <div className=' flex flex-col gap-2.5 w-full'>
                    <InfoComponent label="Width" value={Math.round(imageWidth)} metric="PX" />
                    <InfoComponent label="Height" value={Math.round(imageHeight)} metric="PX" />
                    <InfoComponent label="X" value={Math.round(positionX - (imageWidth * (scale - 1) / 2))} />
                    <InfoComponent label="Y" value={Math.round(positionY - (imageHeight * (scale - 1) / 2))} />
                    <InfoComponent label="Scale" value={Math.round(scale * 100)} metric="%" />
                    <div className="flex justify-center items-center w-full gap-1">
                        <Slider railStyle={{ background: "#6D7C86" }} onChange={(value) => {
                            value < scale ? zoomFunction() : zoomFunction("in")
                        }} value={scale} step={0.05} max={20000 / Math.max(imageHeight, imageWidth)}
                            min={100 / Math.max(imageHeight, imageWidth)} tooltip={{ open: false }} className="w-full " />
                        <img src={Assets.icons.maximize} className="h-6 cursor-pointer hover:opacity-75" onClick={() => fitToWrapper(imageWidth, imageHeight)} />
                    </div>

                </div>
            </div>
            <div className=' flex flex-col gap-3.5 w-full'>
                <div className='text-base text-light-accent font-semibold'>Alignment</div>
                <div className=' flex gap-1 h-[42px] w-full'>
                    <AlignmentButton icon={Assets.icons.align_left} id={"l"} />
                    <AlignmentButton icon={Assets.icons.align_right} id={"r"} />
                    <AlignmentButton icon={Assets.icons.align_center} id={"c"} />
                    <AlignmentButton icon={Assets.icons.align_top} id={"t"} />
                    <AlignmentButton icon={Assets.icons.align_bottom} id={"b"} />
                </div>
            </div>

            <div className=' flex flex-col gap-3.5 w-full h-[154px]'>
                <div className='text-base text-light-accent font-semibold'>Resize</div>
                <div className=' flex flex-col gap-3 h-[42px] w-full relative'>
                    <img src={Assets.line_link} className="h-[48px] absolute left-[174px] top-[13px]" />
                    <div onClick={() => setLinkWH(!linkWH)}
                        className={` w-[26px] ${linkWH ? "bg-[#26485B]" : "bg-dark-blue-2"} hover:[&>*]:opacity-80 cursor-pointer flex justify-center 
                    items-center rounded-[2px] absolute left-[162px] top-[25px] py-[3px]`}>
                        <img src={Assets.icons.link} className="w-[18px] h-[18px]" />
                    </div>
                    {
                        LabeledInput({
                            label: "Width", value: Math.round(tempWidth), onChange: linkWH ? (e) => {
                                setTempHeight(calculate_dimensions(imageWidth, imageHeight, setTempWidthWithVer(e.target.value), tempHeight).height);
                                setTempWidthWithVer(e.target.value);
                            } : (e) => {
                                setTempWidthWithVer(e.target.value);
                            },

                            onPressEnter: (e) => { resizeFunction(setTempHeightWithVer(e.target.value), tempHeight); dispatch(UpdateWrapper(positionX, positionY, setTempHeightWithVer(e.target.value)), tempHeight) }
                        })
                    }
                    {
                        LabeledInput({
                            label: "Height", value: Math.round(tempHeight), onChange: linkWH ? (e) => {
                                setTempWidth(calculate_dimensions(imageWidth, imageHeight, imageWidth, setTempHeightWithVer(e.target.value)).width);
                                setTempHeightWithVer(e.target.value)
                            } : (e) => {
                                setTempHeightWithVer(e.target.value)
                            },

                            onPressEnter: (e) => { resizeFunction(tempWidth, setTempHeightWithVer(e.target.value)); dispatch(UpdateWrapper(positionX, positionY, tempWidth, setTempHeightWithVer(e.target.value))) }
                        })
                    }
                    <InfoComponent label="Current Image size" value={fileSize.toFixed(2)} metric="MB" style={{ padding: "6px 0 0 0" }} />
                </div>
            </div>
            <div className=' flex flex-col gap-3.5 w-full'>
                <div className='text-base text-light-accent font-semibold'>Flip & Rotate</div>
                <div className=' flex gap-1 h-[42px] w-full '>
                    <FlipRotateButton icon={Assets.icons.rotate_counterclockwise} id={"rcc"} onClick={() => rotateFunction(imageHeight, imageWidth, false)} />
                    <FlipRotateButton icon={Assets.icons.rotate_clockwise} id={"rc"} onClick={() => rotateFunction(imageHeight, imageWidth, true)} />
                    <FlipRotateButton icon={Assets.icons.flip_vertical} id={"fv"} onClick={() => canvasObj.flip_function("V")} />
                    <FlipRotateButton icon={Assets.icons.flip_horizontal} id={"fh"} onClick={() => canvasObj.flip_function("H")} />
                </div>
            </div>
        </div>

    );
}

export default CanvasPanel;

