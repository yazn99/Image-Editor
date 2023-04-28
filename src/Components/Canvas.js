import React from 'react';
import { forwardRef } from 'react';

const Canvas = forwardRef(function Canvas(props, ref) {

    
    // }
    return (
        <div>
            <canvas id="hidden_canvas" style={{ display: "none" }} />
            <canvas id="canvas" ref={ref} />
        </div>

    );
})

export default Canvas;