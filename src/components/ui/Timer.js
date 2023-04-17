import "styles/ui/Timer.scss";
import PropTypes from "prop-types";
import { useEffect, useState } from 'react';

export const Timer = props => {
    const timeLimit = 1000 * props.timeLimit;
    const [remainingTime, setRemainingTime] = useState(timeLimit - 1000);

    let startTime = Date.now();

    useEffect(() => {
        const interval = setInterval(() => getTime(), 1000);
        return () => clearInterval(interval);
    },[]);

    const getTime = () => {
        let currentTime = Date.now() - startTime;
        props.getTime(currentTime);
        currentTime = timeLimit - currentTime;
        setRemainingTime(currentTime);
        if (currentTime <= 0) {
            props.timeOut();
        }
    }

    const getSecs = () => {
        let secs = Math.floor(remainingTime / 1000);
        let mins = Math.floor(remainingTime / 1000 / 60);
        secs -= mins * 60;
        return secs;
    }

    return (
        <div className="timer container">
            <div className="timer label">
                {Math.floor(remainingTime / 1000 / 60)}:{getSecs()}
            </div>
            <div style={{ width: '100%' }}>
                <div style={{ width: `${(remainingTime/timeLimit) * 100}%`}} className="timer bar"></div>
            </div>
        </div>
    );
}



Timer.propTypes = {
    timeLimit: PropTypes.number,
    timeOut: PropTypes.func,
    getTime: PropTypes.func
};