import React, { useEffect, useState } from "react";
import music from "music/Derp Nugget.mp3";

const Music = props => {
    const [audio] = useState(new Audio(music));
    localStorage.setItem("volume", 1);

    useEffect(() => {
        console.log("set volume in local storage");
        audio.loop = true;
        audio.volume = parseInt(localStorage.getItem("volume"));
        document.addEventListener("volumeChange", handleVolumeChanged);
        document.addEventListener("playingChange", handlePlayingChanged);
        return () => {
            audio.pause();
            document.removeEventListener("volumeChange", handleVolumeChanged);
            document.removeEventListener("playingChange", handlePlayingChanged);
        };
    },[]);

    const handleVolumeChanged = (e) => {
        console.log("handle volume changed: " + e.detail);
        localStorage.setItem("volume", e.detail);
        audio.volume = e.detail;
        audio.play();
    }

    const handlePlayingChanged = (e) => {
        console.log("handle playing changed, " + e.detail);
        if (e.detail) {
            audio.currentTime = 0;
            audio.loop = true;
        }
        e.detail ? audio.play() : audio.pause();
        audio.volume = parseInt(localStorage.getItem("volume"));
    }

    return (
        <></>
    );
}

export default Music;