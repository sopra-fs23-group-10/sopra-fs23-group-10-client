import React, {useEffect, useState} from 'react';
import {inviteUser, answerInvite, fetchUserById, finishGame, getFinalResults} from 'helpers/restApi';
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


const EndGame = props => {
    const history = useHistory();
    const [result, setResult] = useState(null);
    const [usernameInviting, setUsernameInviting] = useState("");
    const [usernameInvited, setUsernameInvited] = useState("");
    const { gameMode, selecting } = useParams();
    const [rematchSent, setRematchSent] = useState(false);
    const [endedGame, setEndedGame] = useState(false);

    useEffect(() => {
        function handleReceiveReply(e) {
            const accepted = JSON.parse(e.detail)[localStorage.getItem('gameId')];
            if (rematchSent) {
                if (accepted) {
                    localStorage.setItem('question_nr', 1);
                    localStorage.removeItem('startTime');
                    history.push(`/topic-selection/${gameMode}/waiting`);
                } 
                setRematchSent(false);
            }
        }
        
        async function getResults(){
            try {
                const response = await getFinalResults(localStorage.getItem('gameId'));
                const res = new Result(response[response.length-1]);
                setResult(res, () => {
                    endGame();
                });
                getUsers(res);
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
                if (!endedGame) getResults();
            } else {
                let res = JSON.parse(localStorage.getItem('result'));
                setResult(res);
                getUsers(res);
            }
        }

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
        result.invitingPlayerResult > result.invitedPlayerId))
    }

    const resultText = () => {
        if (result) {
            console.log("user id: " + localStorage.getItem('id'));
            console.log("invitedPlayerId: " + result.invitedPlayerId);
            console.log("invitingPlayerId: " + result.invitingPlayerId);
            console.log("invitedPlayerResult: " + result.invitedPlayerResult);
            console.log("invitedPlayerResult: " + typeof result.invitedPlayerResult);
            console.log("invitedPlayerResult: " + parseInt(result.invitedPlayerResult));
            console.log("nvitingPlayerResult: " + result.invitingPlayerResult);
            console.log("nvitingPlayerResult: " + typeof result.invitingPlayerResult);
            console.log("invitedPlayerResult: " + parseInt(result.invitingPlayerResult));
            console.log("won: " + isWon());
            console.log("is invited player: " + (result.invitedPlayerId == parseInt(localStorage.getItem('id'))));
            console.log("is inviting player: " + (result.invitingPlayerId == parseInt(localStorage.getItem('id'))));
            console.log("invited player won: " + (result.invitedPlayerResult > result.invitingPlayerResult));
            console.log("inviting player won: " + (result.invitingPlayerResult > result.invitedPlayerId));
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

    const home = () => {
        localStorage.removeItem('gameId');
        localStorage.removeItem('question_nr');
        localStorage.removeItem('result');
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