import React, { useEffect, useState } from "react";
import music from "music/Derp Nugget.mp3";

const Music = props => {
    const [audio] = useState(new Audio(music));

    useEffect(() => {
        localStorage.setItem("volume", 1);
        audio.loop = true;
        document.addEventListener("volumeChange", handleVolumeChanged);
        document.addEventListener("playingChange", handlePlayingChanged);
        return () => {
            audio.pause();
            document.removeEventListener("volumeChange", handleVolumeChanged);
            document.removeEventListener("playingChange", handlePlayingChanged);
        };
    },[]);

    const handleVolumeChanged = (e) => {
        localStorage.setItem("volume", e.detail);
        audio.volume = e.detail;
    }

    const handlePlayingChanged = (e) => {
        console.log("handle playing changed");
        e.detail ? audio.play() : audio.pause();
    }

    return (
        <></>
    );
}

export default Music;