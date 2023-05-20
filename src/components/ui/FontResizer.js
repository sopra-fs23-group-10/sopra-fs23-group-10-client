import { useEffect, useRef, useState } from "react"

export const FontResizer = props => {
    const [height, setHeight] = useState(0)
    const ref = useRef(null)

    useEffect(() => {
        function handleWindowResize() {
          if (ref) setHeight(ref.current.clientHeight);
        }
    
        window.addEventListener('resize', handleWindowResize);
        if (ref) setHeight(ref.current.clientHeight);
    
        return () => {
          window.removeEventListener('resize', handleWindowResize);
        };
      }, []);

    return (
        <div ref={ref} {...props} style={{ fontSize:height/10}}>
            {props.children}
        </div>
    );
}
