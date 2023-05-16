import "styles/ui/Timer.scss";
import PropTypes from "prop-types";
import { useEffect, useState } from 'react';

export const Timer = props => {
    const timeLimit = 1000 * props.timeLimit;
    const [remainingTime, setRemainingTime] = useState(timeLimit - 1000);

    let startTime = localStorage.getItem('startTime') ? parseInt(localStorage.getItem('startTime')) : Date.now();
    localStorage.setItem('startTime', startTime);

    useEffect(() => {
        function handlePause() {
            localStorage.setItem('paused', true);
        }

        getTime();
        const interval = setInterval(() => getTime(), 1000);
        document.addEventListener('pause', handlePause);
        return () => {
            localStorage.removeItem('paused');
            localStorage.removeItem('startTime');
            clearInterval(interval);
            document.removeEventListener('pause', handlePause);
        }   
    }, []);

    const getTime = () => {
        if (localStorage.getItem('paused') != 'true') {
            let currentTime = Date.now() - startTime;
            currentTime = (props.currentTime ? props.currentTime : timeLimit) - currentTime;
            if (currentTime <= 0) {
                currentTime = 0;
                if (props.timeOut) props.timeOut();
                timeOut();
            }
            if (props.getTime) props.getTime(currentTime);
            setRemainingTime(currentTime);
        }
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
        const event = new CustomEvent("timeOut", { detail: null });
        document.dispatchEvent(event);
    }

    return (
        <div className="timer container" style={!props.display ? {display:"none"} : {}}>
            <div className="timer label">
                {getMins().toString().padStart(2, '0')}:{getSecs().toString().padStart(2, '0')}
            </div>
            <div style={{ width: '100%' }}>
                <div style={{ width: `${(remainingTime/timeLimit) * 100}%`}} className="timer bar"></div>
            </div>
        </div>
    );
}

Timer.propTypes = {
    timeLimit: PropTypes.number,
    currentTime: PropTypes.number,
    timeOut: PropTypes.func,
    getTime: PropTypes.func,
    display: PropTypes.bool
};

Timer.defaultProps = {
    display: true
  };