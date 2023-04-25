import React, {useEffect} from 'react';
import {useState} from 'react';
import {inviteUser, answerInvite, fetchUserById, finishGame, getFinalResults} from 'helpers/restApi';
import {useHistory, useParams, Link} from 'react-router-dom';
import 'styles/views/EndGame.scss';
import GameHeader from "./GameHeader";
import {Button} from "../ui/Button";
import 'styles/views/PopUp.scss';
import { Timer } from 'components/ui/Timer';
import 'styles/ui/Invitation.scss';
import ReceiveInvitation from './ReceiveInvitation';
import BaseContainer from "../ui/BaseContainer";
import Result from "../../models/Result";


const EndGame = props => {
    const history = useHistory();
    const [result, setResult] = useState(null);
    const [usernameInviting, setUsernameInviting] = useState("");
    const [usernameInvited, setUsernameInvited] = useState("");
    const { gameMode, selecting } = useParams();
    const [rematchSent, setRematchSent] = useState(false);
    const [time, setTime] = useState(0);
    const [endedGame, setEndedGame] = useState(false);

    useEffect(() => {
        function handleReceiveReply(e) {
            const accepted = JSON.parse(e.detail)[localStorage.getItem('gameId')];
            if (rematchSent) {
                if (accepted) {
                    console.log("ACCEPTED");
                    localStorage.setItem('question_nr', 1);
                    localStorage.removeItem('startTime');
                    history.push(`/topic-selection/${gameMode}/waiting`);
                } else {
                    localStorage.removeItem('gameId');
                }
                setRematchSent(false);
            }
        }

        function handleSentReply(e) {
            if (selecting == 'selecting') endGame();
        }

        async function getResults(){
            try {
                const response = await getFinalResults(localStorage.getItem('gameId'));
                const res = new Result(response[response.length-1]);
                setResult(res);
        
                await getUser(res.invitingPlayerId, setUsernameInviting);
                await getUser(res.invitedPlayerId, setUsernameInvited);
            } catch(error) {
                alert(error);
                history.push("/login");
            }
        }

        if (!result && !endedGame) getResults();

        document.addEventListener("receiveReply", handleReceiveReply);
        document.addEventListener("sentReply", handleSentReply);
        return () => {
            document.removeEventListener("receiveReply", handleReceiveReply);
            document.addEventListener("sentReply", handleSentReply);
        }   
    });

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
            if (selecting == 'selecting') endGame();
            let id = localStorage.getItem('id') == result.invitedPlayerId ? result.invitingPlayerId : result.invitedPlayerId;
            const response = await inviteUser(id, gameMode.toUpperCase(), "DUEL");
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
            const response = await answerInvite(localStorage.getItem('gameId'), false);
            localStorage.removeItem('gameId');
            setRematchSent(false);
        } catch (error) {
            alert(error);
            history.push("/home");
        }
    }

    const getTime = (time) => {
        setTime(time);
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
                            <Timer timeLimit={200} timeOut={cancelRematch} getTime={getTime}/>
                        </div>
                    </div>
                </div>
            );
        }
    }

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

    const resultText = () => {
        if (result.invitedPlayerResult == result.invitingPlayerResult) {
            return "It's a draw!"
        } else if (result.invitedPlayerId == localStorage.getItem('id') && result.invitedPlayerResult > result.invitingPlayerResult
            || result.invitingPlayerId == localStorage.getItem('id') && result.invitingPlayerResult > result.invitedPlayerId) {
            return "You won!"
        } else {
            return "You lost!"
        }
    }

    const returnToHome = () => {
        if (selecting == 'selecting') endGame();
        home();
    }

    const home = () => {
        localStorage.removeItem('gameId');
        localStorage.removeItem('question_nr');
        history.push("/home");
    }

    const endPointsScreen = () => {
        if (result && usernameInvited && usernameInviting) {
            return (
                <>
                    <div className="grid-1">
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
                                <Button
                                    width="80%"
                                    style={{margin: "auto"}}
                                    onClick={() => rematch()}
                                >
                                    REMATCH
                                </Button>
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
            <GameHeader questionId={localStorage.getItem("question_nr")} showCancelButton={false} height="100"/>
            <div className="ScreenGrid">
                {endPointsScreen()}
            </div>
        </>
    );

};

export default EndGame;