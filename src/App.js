import React, { useEffect, useState, useRef } from 'react';
import init, { alterRed } from "wasm-lib";
import test from './test.jpg';
import "react-image-crop/dist/ReactCrop.css";
import MainWrapper from './CanvasWrapper/MainWrapper';
import { useDispatch, useSelector } from 'react-redux'
import { initialCanvasState } from './Redux/Actions/TransformationsActions';


function App() {
  const dispatch = useDispatch();
  const canvasState = useSelector((state) => state.Transformations)
  const {canvasWidth, canvasHeight}= canvasState; 

  useEffect(() => {
    init().then(() => {
      //console.log(parentWidth, parentHeight)
      const imgObject = new Image();
      imgObject.onload = () => {
        drawImage(imgObject)
        //alterRed("canvas", 250);
      }
      imgObject.src = test;
    });

  }, [])

  const drawImage = (img) => {
    const canvas = document.getElementById("canvas");
    var hRatio = window.innerWidth / img.width;
    var vRatio = window.innerHeight / img.height;
    var ratio = Math.min(hRatio, vRatio);
    //set the canvas size same as the image size
    canvas.width = img.width * ratio;
    canvas.height = img.height * ratio;
    const ctx = canvas.getContext("2d");
    var centerShift_x = (canvas.width - img.width * ratio) / 2;
    var centerShift_y = (canvas.height - img.height * ratio) / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, img.width, img.height,
      centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
    dispatch(initialCanvasState({
      canvasWidth: canvas.width,
      canvasHeight: canvas.height
    }))
  }

  return (
    <div>
      <MainWrapper />
    </div>

  );
}
export default App;