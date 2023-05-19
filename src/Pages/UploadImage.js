import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { UpdateCanvas } from '../Redux/Actions/CanvasActions';
import { Assets } from "../Constants/General";
import { Upload } from 'antd';
import "./Styles/UploadImage.css";
import { useNavigate } from "react-router-dom";
import { Reset } from '../Redux/Actions/TransformationsActions';
import { SetCropping, UpdateWrapper } from '../Redux/Actions/CropperActions';

const { Dragger } = Upload;


function UploadImage() {
    const dispatch = useDispatch();
    const canvasState = useSelector((state) => state.Canvas)
    const { canvasCreated, imageWidth, imageHeight, canvasObj, imageObj } = canvasState;
    const navigate = useNavigate();

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
                    dispatch(UpdateWrapper(0, 0, imgObject.width, imgObject.height))
                    dispatch(UpdateCanvas({
                        imageObj: imgObject,
                        //fileSize: info.file.size/(1024*1024),
                    }))

                }

                imgObject.src = evt.target.result;
            }
        }
        if (status === 'done') {
            setTimeout(() => {
                navigate("/editor")
            }, 500);

        } else if (status === 'error') {
            setTimeout(() => {
                navigate("/editor")
            }, 500);
        }
    }


    return (
        <div className="bg-dark-blue w-full h-full flex flex-col" >
            <div className="bg-dark-blue-2 w-full flex justify-center items-center p-5" >
                <img src={Assets.Logo} className="w-32 " />
            </div>
            <div className="flex flex-col justify-center items-center gap-7 w-full h-full" >
                <Dragger showUploadList={false} {...uploadProps} className="dragger ">
                    <div className="flex flex-col justify-center items-center gap-3">
                        <img src={Assets.icons.document_cloud} />
                        <div className="text-white text-xl capitalize">
                            Drop your image here
                        </div>
                    </div>

                </Dragger>
                <div className="flex justify-center items-center gap-3">
                    <div className="text-light-accent/75 text-sm capitalize">
                        Or upload it from your files
                    </div>
                    <Upload showUploadList={false} {...uploadProps}>
                        <button className="btn-primary">
                            Upload
                        </button>
                    </Upload>

                </div>
            </div>
        </div >

    );
}

export default UploadImage;