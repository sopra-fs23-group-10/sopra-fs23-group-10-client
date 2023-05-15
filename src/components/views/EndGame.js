import React, {useEffect, useState} from 'react';
import {createGame, handleError, answerInvite, fetchUserById, finishGame, getFinalResults} from 'helpers/restApi';
import {useHistory, useParams} from 'react-router-dom';
import 'styles/views/EndGame.scss';
import GameHeader from "./GameHeader";
import {Button} from "../ui/Button";
import 'styles/views/PopUp.scss';
import { Timer } from 'components/ui/Timer';
import 'styles/ui/Invitation.scss';
import ReceiveInvitation from './ReceiveInvitation';
import BaseContainer from "../ui/BaseContainer";
import Result from "../../models/Result";
import { ResultList } from 'components/ui/ResultList';


const EndGame = props => {
    const history = useHistory();
    const [result, setResult] = useState(null);
    const [usernameInviting, setUsernameInviting] = useState("");
    const [usernameInvited, setUsernameInvited] = useState("");
    const { gameMode, playerMode, selecting } = useParams();
    const [rematchSent, setRematchSent] = useState(false);
    const [endedGame, setEndedGame] = useState(false);
    const [results, setResults] = useState(null);

    useEffect(() => {
        function handleReceiveReply(e) {
            const accepted = JSON.parse(e.detail)[localStorage.getItem('gameId')];
            if (!accepted) {
                history.push('/home');
                return;
            }

            if (rematchSent) {
                if (accepted) {
                    localStorage.setItem('question_nr', 1);
                    localStorage.removeItem('startTime');
                    history.push(`/topic-selection/duel/${gameMode}/waiting`);
                }
                setRematchSent(false);
            }
        }
        
        async function getResults(){
            try {
                const response = await getFinalResults(localStorage.getItem('gameId'));
                const res = new Result(response[response.length-1]);
                console.log(response);
                setResult(res);
                setResults(Array.from(response).slice(0, -1));
                getUsers(res).catch(error => {
                    console.error(error);
                });
                if (result) {
                    endGame().catch(error => {
                        console.error(error);
                    });
                }
            } catch(error) {
                alert(error);
                history.push("/login");
            }
        }

        async function getUsers(res) {
            await getUser(res.invitingPlayerId, setUsernameInviting);
            await getUser(res.invitedPlayerId, setUsernameInvited);
        }

        if (!result) {
            if (selecting == 'selecting') {
                if (!endedGame) {
                    getResults().catch(error => {
                        console.error(error);
                    });
                }
            } else {
                let res = JSON.parse(localStorage.getItem('result'));
                console.log(res);
                console.log(res[res.length-1]);
                console.log(Array.from(res).slice(0,-1));
                setResult(res[res.length-1]);
                setResults(Array.from(res).slice(0,-1));
                getUsers(res[res.length-1]).catch(error => {
                    console.error(error);
                });
            }
        }

        if (playerMode == 'single') localStorage.removeItem('gameId');

        document.addEventListener("receiveReply", handleReceiveReply);
        return () => {
            document.removeEventListener("receiveReply", handleReceiveReply);
        }   
    });

    async function endGame(){
        if (!endedGame) {
            try {
                await finishGame(localStorage.getItem('gameId'));
            } catch(error) {
                alert(error);
                history.push("/login");
            }
        }
    }

    const getUser = async (id, callback) => {
        try {
            const userData = await fetchUserById(id);
            callback(userData.username);
        } catch (error){
            alert(error);
        }
    }

    const rematch = async () => {
        try {
            let id = localStorage.getItem('id') == result.invitedPlayerId ? result.invitingPlayerId : result.invitedPlayerId;
            const response = await createGame(id, gameMode.toUpperCase(), "DUEL");
            localStorage.setItem('gameId', response.gameId);
            setRematchSent(true);
            setEndedGame(true);
        } catch (error) {
            alert(error);
            history.push("/home");
        }
    }

    const cancelRematch = async () => {
        try {
            await answerInvite(localStorage.getItem('gameId'), false);
            localStorage.removeItem('gameId');
            setRematchSent(false);
        } catch (error) {
            alert(error);
            history.push("/home");
        }
    }

    const sentRematch = () => {
        if (rematchSent) {
            return (
                <div className ='invite-sent'>
                    <div className = "invitation overlay">
                    </div>
                    <div className = "invitation base-container">
                        <p> Rematch has been sent. Waiting for answer...</p>
                        <div className="button-container">
                            <Timer timeLimit={60} timeOut={cancelRematch}/>
                        </div>
                    </div>
                </div>
            );
        }
    }

    const isWon = () => {
        return ((result.invitedPlayerId == parseInt(localStorage.getItem('id')) && 
        result.invitedPlayerResult > result.invitingPlayerResult) || 
        (result.invitingPlayerId == parseInt(localStorage.getItem('id')) && 
        result.invitingPlayerResult > result.invitedPlayerResult))
    }

    const pastResults = (inviting) => {
        if (results) {
            let playerResults = [];
            for (let r of results) {
                inviting ? playerResults.push(r.invitingPlayerResult) : playerResults.push(r.invitedPlayerResult)
            }
            return playerResults;
        }
    }

    const drawResults = () => {
        if (results) {
            if (playerMode == 'duel') {
                if (results && usernameInvited && usernameInviting) {
                    return (
                        <div className="result-list-container grid">
                            <ResultList style={{gridColumn:1}} results={pastResults(true)}/>
                            <ResultList style={{gridColumn:2}} results={pastResults(false)}/>
                        </div>
                    );
                }
            } else if (result && usernameInviting){
                return(
                    <div className="result-list-container">
                        <ResultList results={pastResults(true)}/>
                    </div>
                );
            }
        }
    }

    const resultText = () => {
        if (result) {
            if (result.invitedPlayerResult == result.invitingPlayerResult) {
                return "It's a draw!"
            } else if (isWon()) {
                return "You won!"
            } else {
                return "You lost!"
            }
        } else {
            return "Waiting..."
        }
    }

    const returnToHome = () => {
        home();
    }

    const cleanup = () => {
        localStorage.removeItem('gameId');
        localStorage.removeItem('question_nr');
        localStorage.removeItem('result');
        localStorage.removeItem('topic');
    }

    const home = () => {
        cleanup();
        history.push("/home");
    }

    async function newGame() {
        try {
            console.log("new game");
            const response = await createGame(0, gameMode.toUpperCase(), 'SINGLE');
            console.log(response);
            localStorage.setItem('gameId', response.gameId);
            if (response) {
                if (gameMode == 'text'){
                    history.push("/single-topic-selection/" + gameMode.toLowerCase());
                } else {
                    history.push("/single-image-start/" + gameMode.toLowerCase());
                }
            }
        } catch (error) {
            alert(`Something went wrong while creating a new game, ${handleError(error)}`);
        }
    }

    const replay = () => {
        newGame().catch(error => {
            console.error(error);
        });
    }

    const repeatButton = () => {
        if (playerMode == 'duel') {
            return (
                <Button
                    width="80%"
                    style={{margin: "auto"}}
                    onClick={() => rematch()}
                    >
                    REMATCH
                </Button>
            );
        } else {
            return (
                <Button
                    width="80%"
                    style={{margin: "auto"}}
                    onClick={() => replay()}
                    >
                    REPLAY
                </Button>
            );
        }
    }

    const endPointsScreen = () => {
        if (playerMode == 'duel'){
                if (result && usernameInvited && usernameInviting) {
                    return (
                        <>
                            {drawResults()}
                            <div style={{gridColumn:1}} className="grid-1">
                                <div className="title" style={{textAlign: "left"}}>
                                    Player 1
                                </div>
                                <div className="title" style={{textAlign: "right"}}>
                                    Player 2
                                </div>
                                {result.invitingPlayerResult > result.invitedPlayerResult ? (
                                    <div className="background-points-winner">
                                        <div className = "player" style={{textAlign: "center"}}>
                                            {usernameInviting}
                                        </div>
                                        <div className = "points-endgame" style={{textAlign: "center"}}>
                                            {result.invitingPlayerResult}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="background-points-loser">
                                        <div className = "player player-loser" style={{textAlign: "center"}}>
                                            {usernameInviting}
                                        </div>
                                        <div className = "points-endgame points-loser" style={{textAlign: "center"}}>
                                            {result.invitingPlayerResult}
                                        </div>
                                    </div>
                                ) }
                                {result.invitingPlayerResult < result.invitedPlayerResult ? (
                                    <div className="background-points-winner">
                                        <div className = "player" style={{textAlign: "center"}} >
                                            {usernameInvited}
                                        </div>
                                        <div className = "points-endgame" style={{textAlign: "center"}}>
                                            {result.invitedPlayerResult}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="background-points-loser">
                                        <div className = "player player-loser" style={{textAlign: "center"}}>
                                            {usernameInvited}
                                        </div>
                                        <div className = "points-endgame points-loser" style={{textAlign: "center"}}>
                                            {result.invitedPlayerResult}
                                        </div>
                                    </div>
                                ) }
                            </div>
                            <div className="background-rematchoption">
                                <div className="content">
                                    <div className="topic endgame" style={{textAlign: "center"}}>
                                        {resultText()}
                                    </div>
                                    <div className="twoButtons">
                                        {repeatButton()}
                                        <Button
                                            width="80%"
                                            style={{margin: "auto"}}
                                            onClick={() => returnToHome()}
                                        >
                                            RETURN HOME
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </>
                    );
                }
        } else if(result && usernameInviting){
            return (
                <>
                    {drawResults()}
                    <div style={{ position: 'relative', gridColumn:1, height:"40vh"}} >
                        <div className="background-points-winner" style={{ width: '100%', height: '100%', position: 'absolute' }}>
                            <div className = "player" style={{textAlign: "center"}}>
                                {usernameInviting}
                            </div>
                            <div className = "points-endgame" style={{textAlign: "center"}}>
                                {result.invitingPlayerResult}
                            </div>
                        </div>
                    </div>
                    <>
                        <div style={{ paddingTop: '40px' }}></div>
                    </>
                    <div className="background-rematchoption" >
                        <div className="content">
                            <div className="twoButtons">
                                {repeatButton()}
                                <Button
                                    width="80%"
                                    style={{margin: "auto"}}
                                    onClick={() => returnToHome()}
                                >
                                    RETURN HOME
                                </Button>
                            </div>
                        </div>
                    </div>
                </>
                )
        } else {
            return <BaseContainer>Calculating result...</BaseContainer>
        }
    }

    const drawRematch = () => {
        return (
            <>
                {sentRematch()}
                <ReceiveInvitation/>
            </>
        )
    }

    return (
        <>
            {drawRematch()}
            <GameHeader playerMode={playerMode} questionId={localStorage.getItem("question_nr")} showCancelButton={false} height="100"/>
            <div className="ScreenGrid">
                {endPointsScreen()}
            </div>
        </>
    );

};

export default EndGame;