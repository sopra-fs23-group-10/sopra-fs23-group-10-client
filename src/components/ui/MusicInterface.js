import React,{useEffect, useState} from 'react';
import "styles/views/PopUp.scss";
import Slider from "rc-slider";
import up from "images/volume--up.svg";
import down from "images/volume--down.svg";
import mute from "images/volume--mute.svg";
import "styles/ui/MusicInterface.scss";
import BaseContainer from './BaseContainer';

const MusicInterface = props => {
    const [volume, setVolume] = useState(parseFloat(localStorage.getItem("volume")));
    const [prevVolume, setPrevVolume] = useState(parseFloat(localStorage.getItem("volume")));
    const color = "#4B1BCE";

    const onMusicChange = (value) => {
        setVolume(value);
        const event = new CustomEvent('volumeChange', { detail: value });
        document.dispatchEvent(event);
    }

    const toggleMute = () => {
        if (volume == 0) {
            onMusicChange(prevVolume);
        } else {
            setPrevVolume(volume);
            onMusicChange(0);
        }
    }

    const icon = () => {
        if (volume == 0) return mute;
        else if (volume < 0.5) return down;
        else return up;
    }

    return (
        <BaseContainer className="music-interface container">
            <img className="volume-icon" src={icon()} onClick={() => toggleMute()}></img>
            <Slider trackStyle={{backgroundColor:color}} handleStyle={{backgroundColor:color, borderColor:color, opacity:1, boxShadow:"none"}} min={0} max={1} step={0.001} value={volume} onChange={onMusicChange}/>
        </BaseContainer>  
    );
};


export default MusicInterface;
