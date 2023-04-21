import "styles/ui/Timer.scss";
import PropTypes from "prop-types";
import { useEffect, useState } from 'react';
import { publish } from "helpers/events";

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
        currentTime = (props.currentTime ? props.currentTime : timeLimit) - currentTime;
        if (currentTime <= 0) {
            console.log("timer is zero!");
            currentTime = 0;
            timeOut();
        }
        if (props.getTime) props.getTime(currentTime);
        setRemainingTime(currentTime);
    }

    const getSecs = () => {
        let secs = Math.floor(remainingTime / 1000);
        let mins = Math.floor(remainingTime / 1000 / 60);
        secs -= mins * 60;
        return secs;
    }

    const getMins = () => {
        let mins = Math.floor(remainingTime / 1000 / 60);
        return mins
    }

    const timeOut = () => {
        publish('timeOut');
    }

    return (
        <div className="timer container">
            <div className="timer label">
                {getMins().toString().padStart(2, '0')}:{getSecs().toString().padStart(2, '0')}
            </div>
            <div style={{ width: '100%' }}>
                <div style={{ width: `${(remainingTime/timeLimit) * 100}%`, background:props.color}} className="timer bar"></div>
            </div>
        </div>
    );
}

Timer.propTypes = {
    timeLimit: PropTypes.number,
    currentTime: PropTypes.number,
    timeOut: PropTypes.func,
    getTime: PropTypes.func,
    color: PropTypes.string
};