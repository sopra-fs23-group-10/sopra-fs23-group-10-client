import React from 'react';
//import {api, handleError} from 'helpers/api';
//import {useHistory, useParams} from 'react-router-dom';
//import 'styles/views/TopicSelectionSingle.scss';
import BaseContainer from "components/ui/BaseContainer";
import GameHeader from "./GameHeader";
import {Button} from "../ui/Button";
import 'styles/views/PopUp.scss';



const TopicSelectionSingle = props => {

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
                    <div className="background-points">
                        <div className = "player" style={{textAlign: "center"}}>
                            Player 1
                        </div>
                        <div className = "points" style={{textAlign: "center"}}>
                            0
                        </div>
                    </div>
                    <div className="background-points">
                        <div className = "player" style={{textAlign: "center"}} >
                            Player 2
                        </div>
                        <div className = "points" style={{textAlign: "center"}}>
                            0
                        </div>
                    </div>
                </div>

                <div className="grid-2">
                    <div className="title grid2" style={{textAlign: "left"}}>
                        Select a topic
                    </div>
                    <div className="background-topicSelection">
                        <div className="topic" style={{textAlign: "center"}}>
                            Topic 1
                        </div>
                    </div>
                    <div className="background-topicSelection">
                        <div className="topic" style={{textAlign: "center"}} >
                            Topic 2
                        </div>
                    </div>
                    <div className="background-topicSelection">
                        <div className="topic" style={{textAlign: "center"}}>
                            Topic 3
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

};

export default TopicSelectionSingle;
