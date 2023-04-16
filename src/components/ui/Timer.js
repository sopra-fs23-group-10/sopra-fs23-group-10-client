import "styles/ui/Timer.scss";
import PropTypes from "prop-types";
import { useEffect, useState } from 'react';

export const Timer = props => {
    // const [startTime, setStartTime] = useState(0);
    const timeLimit = 1000 * 30;
    const [remainingTime, setRemainingTime] = useState(timeLimit - 1000);

    let startTime = Date.now();

    useEffect(() => {
        console.log("USE EFFECT");
        // setStartTime(Date.now());
        // console.log("now: " + Date.now());
        // if (startTime != 0) {
            const interval = setInterval(() => getTime(), 1000);
            return () => clearInterval(interval);
        // }
    },[]);

    const getTime = () => {
        let currentTime = Date.now() - startTime;
        console.log(currentTime);   
        props.getTime(currentTime);
        currentTime = timeLimit - currentTime;
        setRemainingTime(currentTime);
        if (currentTime <= 0) {
            props.timeOut();
        }
    }

    return (
        <div className="timer container">
            <div className="timer label">
                0:{Math.floor(remainingTime / 1000)}
            </div>
            <div style={{ width: '100%' }}>
                <div style={{ width: `${(timeLimit/remainingTime) * 100}%`}} className="timer bar"></div>
            </div>
        </div>
    );
}



Timer.propTypes = {
  timeOut: PropTypes.func,
  getTime: PropTypes.func
};