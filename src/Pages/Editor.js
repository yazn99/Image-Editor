import React, { useEffect, useState, useRef } from 'react';
import CanvasWrapper from '../CanvasWrapper/CanvasWrapper';
import Header from '../Components/Editor/Header';
import Footer from '../Components/Editor/Footer';
import SidePanel from '../Components/Editor/SidePanel/SidePanel';

function Editor() {
    return (
        <div className="bg-dark-blue w-full h-full flex flex-col">
            <Header />
            <div className=" w-full h-full flex">
                <SidePanel />
                <CanvasWrapper />
            </div>

            <Footer />
        </div>
    );
}

export default Editor;