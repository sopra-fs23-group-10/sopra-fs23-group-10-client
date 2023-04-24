import React, {useEffect} from 'react';
import {useState} from 'react';
import {inviteUser, answerInvite, fetchUserById, finishGame} from 'helpers/restApi';
import {useHistory, useParams, Link} from 'react-router-dom';
import 'styles/views/EndGame.scss';
import GameHeader from "./GameHeader";
import HomeHeader from "./HomeHeader";
import {Button} from "../ui/Button";
import 'styles/views/PopUp.scss';
import { PlayerList } from 'components/ui/PlayerList';
import { Timer } from 'components/ui/Timer';
import 'styles/ui/Invitation.scss';
import ReceiveInvitation from './ReceiveInvitation';
import BaseContainer from "../ui/BaseContainer";
import Result from "../../models/Result";
import { connectResult } from 'helpers/WebSocketFactory';



const EndGame = props => {
    const history = useHistory();
    const [result, setResult] = useState(null);
    const [usernameInviting, setUsernameInviting] = useState("");
    const [usernameInvited, setUsernameInvited] = useState("");

    const { gameMode, selecting } = useParams();
    const [users, setUsers] = useState(null);
    const [rematchSent, setRematchSent] = useState(false);
    const [time, setTime] = useState(0);

    useEffect(() => {
        if (selecting != 'selecting') connectResult(handleResult);

        async function endGame(){
            try {
                console.log("gameId: " + localStorage.getItem('gameId'));
                const response = await finishGame(localStorage.getItem('gameId'));
                const res = new Result(response[response.length-1]);
                console.log(res);
                setResult(res);
        
                await getUser(res.invitingPlayerId, setUsernameInviting);
                await getUser(res.invitedPlayerId, setUsernameInvited);
            } catch(error) {
                alert(error);
                history.push("/login");
            }
        }

        if (selecting == 'selecting') {
            setTimeout(() => {  endGame(); }, 2000);
        }
    }, []);

    const getUser = async (id, callback) => {
        try {
            const userData = await fetchUserById(id);
            callback(userData.username);
        } catch (error){
            alert(error);
        }
    }

    const handleResult = async (msg) => {
        let response = JSON.parse(msg);
        let res = new Result(response[response.length-1]);
        setResult(res);

        await getUser(res.invitingPlayerId, setUsernameInviting);
        await getUser(res.invitedPlayerId, setUsernameInvited);
    }

    const rematch = async () => {
        try {
            let id = localStorage.getItem('id') == result.invitedPlayerId ? result.invitingPlayerId : result.invitedPlayerId;
            const response = await inviteUser(id, gameMode.toUpperCase(), "DUEL");
            localStorage.setItem('gameId', response.id);
            setRematchSent(true);
        } catch (error) {
            history.push("/home");
        }
    }

    const cancelRematch = async () => {
        try {
            const response = await answerInvite(localStorage.getItem('gameId'), false);
            localStorage.removeItem('gameId');
            setRematchSent(false);
        } catch (error) {
            history.push("/home");
        }
    }

    const getTime = (time) => {
        setTime(time);
    }

    const handleAnswer = (msg) => {
        console.log(msg);
        const accepted = JSON.parse(msg)[localStorage.getItem('gameId')];
        if (accepted) {
            history.push('topic-selection/waiting');
        } else {
            localStorage.removeItem('gameId');
            setRematchSent(false);
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
                            <Timer timeLimit={90} timeOut={cancelRematch} getTime={getTime}/>
                        </div>
                    </div>
                </div>
            );
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

    const goToHome = () => {
        localStorage.removeItem('gameId');
        localStorage.removeItem('question_nr');
        history.push("/home");
    }

    const RematchButton = () => {
        return (
            <>
                {sentRematch()}
                <HomeHeader height = "100" />
                <ReceiveInvitation onAnswer={handleAnswer}/>
                <div className ='challenge pop up grid'>
                    <Link to="/home" className = 'back'> x Cancel</Link>
                    <BaseContainer className = "popup container">
                        <h3 className='popup title'> Challenge Player</h3>
                        <PlayerList action ={rematch}/>
                    </BaseContainer>
                </div>
            </>
        )
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
                        <div className="background-points-winner">
                            <div className = "player" style={{textAlign: "center"}}>
                                {usernameInviting}
                            </div>
                            <div className = "points-endgame" style={{textAlign: "center"}}>
                                {result.invitingPlayerResult}
                            </div>
                        </div>
                        <div className="background-points-loser">
                            <div className = "player player-loser" style={{textAlign: "center"}} >
                                {usernameInvited}
                            </div>
                            <div className = "points-endgame points-loser" style={{textAlign: "center"}}>
                                {result.invitedPlayerResult}
                            </div>
                        </div>
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
                                    onClick={RematchButton}
                                >
                                    REMATCH
                                </Button>
                                <Button
                                    width="80%"
                                    style={{margin: "auto"}}
                                    onClick={() => goToHome()}
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

    return (
        <>
            <GameHeader questionId={localStorage.getItem("question_nr")} height="100"/>
            <div className= "ScreenGrid">
                {endPointsScreen()}
            </div>
        </>
    );

};

export default EndGame;