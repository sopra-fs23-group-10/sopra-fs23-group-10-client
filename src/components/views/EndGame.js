import React from 'react';
//import {api, handleError} from 'helpers/api';
//import {useHistory, useParams} from 'react-router-dom';
import 'styles/views/EndGame.scss';
import GameHeader from "./GameHeader";
import {Button} from "../ui/Button";
import 'styles/views/PopUp.scss';
import {useHistory} from "react-router-dom";



const EndGame = props => {
    const history = useHistory();
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
                    <div className="background-points-winner">
                        <div className = "player" style={{textAlign: "center"}}>
                            Player 1
                        </div>
                        <div className = "points" style={{textAlign: "center"}}>
                            0
                        </div>
                    </div>
                    <div className="background-points-loser">
                        <div className = "player player-loser" style={{textAlign: "center"}} >
                            Player 2
                        </div>
                        <div className = "points points-loser" style={{textAlign: "center"}}>
                            0
                        </div>
                    </div>
                </div>
                <div className="background-rematchoption">
                    <div className="content">
                        <div className="topic" style={{textAlign: "center"}}>
                            You lost!
                        </div>
                        <div className="twoButtons">
                            <Button
                                width="80%"
                                style={{margin: "auto"}}
                                //onClick={() => history.push('/home')}
                            >
                                RESET
                            </Button>
                            <Button
                                width="80%"
                                style={{margin: "auto"}}
                                onClick={() => history.push('/login')}
                            >
                                GO BACK
                            </Button>
                        </div>
                    </div>
                </div>
                </div>
        </>
    );

};

export default EndGame;