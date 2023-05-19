import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Assets } from "../../Constants/General";
import { UpdateCanvas } from '../../Redux/Actions/CanvasActions';
import { Upload } from 'antd';
import { Reset } from '../../Redux/Actions/TransformationsActions';
import { SetCropping, UpdateWrapper } from '../../Redux/Actions/CropperActions';


function Header() {

    const dispatch = useDispatch();

    const canvas = useSelector((state) => state.Canvas)
    const { imageName } = canvas;

    const transformations = useSelector((state) => state.Transformations)
    const { positionX, positionY, scale } = transformations;

    const uploadProps = {
        name: 'file',
        multiple: true,
        onChange(info) {
            handleUpload(info)
        },
        onDrop(info) {
            handleUpload(info)
        },
    };

    const handleUpload = (info) => {
        //console.log(info.file)
        dispatch(UpdateCanvas({
            imageName: info.file.name
        }))

        const imgObject = new Image();

        dispatch(Reset())
        const { status } = info.file;

        if (status !== 'uploading') {

            let reader = new FileReader();
            reader.readAsDataURL(info.file.originFileObj);

            reader.onload = evt => {

                imgObject.onload = () => {
                    dispatch(SetCropping(false))
                    

                }

                imgObject.src = evt.target.result;
            }
        }
        if (status === 'done') {
            dispatch(UpdateCanvas({
                imageObj: imgObject,
                //fileSize: info.file.size/(1024*1024),
            }))
            dispatch(UpdateWrapper(0, 0, imgObject.width, imgObject.height))
        } else if (status === 'error') {
            dispatch(UpdateCanvas({
                imageObj: imgObject
            }))
            dispatch(UpdateWrapper(0, 0, imgObject.width, imgObject.height))
        }
    }

    return (

        <div className="bg-dark-blue-2 w-full grid grid-cols-3 px-6 h-20" >
            <div className='flex content-center justify-start gap-1'>
                <div className='text-sm text-white font-semibold self-center line-clamp-1'>{`${imageName}`}</div>
                <div className='text-sm text-white font-semibold self-center line-clamp-1 w-32'>{` (${Math.round(scale * 100)}%)`}</div>
            </div>
            <div className='flex content-center justify-center'>
                <img src={Assets.Logo} className="w-24 self-center" />
            </div>
            <div className='flex content-center justify-end '>
            <Upload className="self-center" showUploadList={false} {...uploadProps}>
                <button className="btn-primary">Upload Image</button>
            </Upload>
            </div>
            

        </div>
    );
}

export default Header;