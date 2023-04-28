import React, { useEffect, useState, useRef } from 'react';
import test from './test.jpg';
import CanvasWrapper from './CanvasWrapper/CanvasWrapper';
import { useDispatch, useSelector } from 'react-redux'
import { UpdateCanvas, CreateCanvas } from './Redux/Actions/CanvasActions';
import { Routes, Route } from "react-router-dom"
import UploadImage from './Pages/UploadImage';
import Editor from './Pages/Editor';


function App() {

  const dispatch = useDispatch();
  const canvasState = useSelector((state) => state.Transformations)

  useEffect(() => {
    dispatch(UpdateCanvas({
      imageSrc: test,
    }))
  }, [])

  return (
    <div style={{ overflow: "hidden", width: "100vw", height: "100vh" }}>
      <Routes>
        <Route path="/" element={<UploadImage />} />
        <Route path="/editor" element={<Editor />} />
      </Routes>

    </div>

  );
}
export default App;