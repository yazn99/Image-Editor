import React, { useEffect, useState, useRef } from 'react';
import CanvasWrapper from '../CanvasWrapper/CanvasWrapper';

function Editor() {
    return ( 
        <div style={{ overflow: "hidden", width: "100%", height: "100%" }}>
            <CanvasWrapper />
        </div>
     );
}

export default Editor;