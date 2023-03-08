import React, { useEffect, useState, useRef } from 'react';
import ImageWrapper from './ImageWrapper';


function MainWrapper() {
    const [width, setWidth] = useState(1);
    const [height, setHeight] = useState(1);

    const handleElementResized = () => {
        if (observedDiv.current.offsetWidth !== width) {
            setWidth(observedDiv.current.offsetWidth);
        }
        if (observedDiv.current.offsetHeight !== height) {
            setHeight(observedDiv.current.offsetHeight);
        }
    }

    // useRef allows us to "store" the div in a constant, 
    // and to access it via observedDiv.current
    const observedDiv = useRef(null);

    // we also instantiate the resizeObserver and we pass
    // the event handler to the constructor
    const resizeObserver = new ResizeObserver(handleElementResized);

    useEffect(() => {
        // the code in useEffect will be executed when the component
        // has mounted, so we are certain observedDiv.current will contain
        // the div we want to observe
        resizeObserver.observe(observedDiv.current);


        // if useEffect returns a function, it is called right before the
        // component unmounts, so it is the right place to stop observing
        // the div
        return function cleanup() {
            resizeObserver.disconnect();
        }
    })
    useEffect(() => {
        //console.log(height)
    }, [height])
    return (
        <div ref={observedDiv} className="App" style={{ height:"100vh", width: "100vw", background:"black", display:"flex", alignItems:"center", justifyContent:"center"}}>
            <ImageWrapper parentWidth={width} parentHeight={height} />
        </div>
    );
}
export default MainWrapper;