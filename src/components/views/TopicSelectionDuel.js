import React from 'react';
//import {api, handleError} from 'helpers/api';
//import {useHistory, useParams} from 'react-router-dom';
import 'styles/views/TopicSelectionDuel.scss';
import BaseContainer from "components/ui/BaseContainer";
import GameHeader from "./GameHeader";
import {Button} from "../ui/Button";
import 'styles/views/PopUp.scss';



const TopicSelectionDuel = props => {

    return (
        <>
            <GameHeader height="100"/>
            <div className= "ScreenGrid">
                <div className="grid-1">
                    <div className="title" style={{textAlign: "left"}}>
                        Player 1
                    </div>
                    <div className="title" style={{textAlign: "right"}}>
                        Player 2
                    </div>
                    <div className="points-grid">
                        <div className = "points-content player" style={{textAlign: "center"}}>
                            Player 1
                        </div>
                        <div className = "points-content points" style={{textAlign: "center"}}>
                            0
                        </div>
                    </div>
                    <div className="points-grid">
                        <div className = "points-content player" style={{textAlign: "center"}}>
                            Player 2
                        </div>
                        <div className = "points-content points" style={{textAlign: "center"}}>
                            0
                        </div>
                    </div>
                </div>
                <div className="grid-2">
                    <div className="title" style={{textAlign: "left"}}>
                        Select a topic
                    </div>
                    <div className="topic" >
                        Topic 1
                    </div>
                    <div className="topic" >
                        Topic 2
                    </div>
                    <div className="topic" >
                        Topic 3
                    </div>
                </div>
            </div>
        </>
    );

};

export default TopicSelectionDuel;

//<BaseContainer className="popup container">
//    Test
//</BaseContainer>
//<BaseContainer className="popup container">
//    Test2
//</BaseContainer>