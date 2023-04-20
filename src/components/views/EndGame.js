import React, {useEffect} from 'react';
import {useState} from 'react';
import {inviteUser, answerInvite, fetchUserById, fetchUsersInGame, finishGame} from 'helpers/restApi';
import {useHistory, useParams, Link, useLocation} from 'react-router-dom';
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



const EndGame = props => {
    const history = useHistory();
    const [result, setResult] = useState(null);
    const [usernameInviting, setUsernameInviting] = useState("");
    const [usernameInvited, setUsernameInvited] = useState("");

    const { gameMode } = useParams();
    const [users, setUsers] = useState(null);
    const [rematchSent, setRematchSent] = useState(false);
    const [time, setTime] = useState(0);
    const [previousGame, setPreviousGame] = useState(null);

    useEffect(() => {

        async function fetchGameResults(){
            try{
                const response = await finishGame(localStorage.getItem("gameId"));
                const res = new Result(response);
                setResult(res);
                await getUser(res.invitingPlayerId, setUsernameInviting);
                await getUser(res.invitedPlayerId, setUsernameInvited);
            } catch(error){
                alert(error);
                history.push("/login")
            }
        }
        const getUser = async (id, callback) => {
            try{
                const userData = await fetchUserById(users);
                callback(userData.username);
            } catch (error){
                alert(error);
            }
        }
            fetchGameResults();
    }, []);


    const rematch = async (id) => {
        try {
            const response = await inviteUser(id, gameMode.toUpperCase(), "DUEL");
            localStorage.setItem('gameId', response.id);
            setRematchSent(true);
        } catch (error) {
            history.push("/home");
        }
    }

    const cancelRematch = async () => {
        try {
            const response = await answerInvite (localStorage.getItem('gameId'), false);
            localStorage.removeItem('gameId');
            setRematchSent(false);
        } catch (error) {
            history.push("/home");
        }
    }

    const getTime = (time) => {
        setTime(time);
    }

    const answer = (msg) => {
        console.log("HANDLE ANSWER INVITING");
        console.log(msg);
        const accepted = JSON.parse(msg)[localStorage.getItem('gameId')];
        if (accepted) {
            history.push({
                pathname: '/topic-selection',
                search: '?update=true',  // query string
                state: {  // location state
                    turn: false,
                    nr: 1,
                    finished: false
                },
            });
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

    const RematchButton = () => {
        return (
            <>
                {sentRematch()}
                <HomeHeader height = "100" />
                <ReceiveInvitation onAnswer={answer}/>
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
                                onClick={RematchButton}
                            >
                                REMATCH
                            </Button>
                            <Button
                                width="80%"
                                style={{margin: "auto"}}
                                onClick={() => history.push('/home')}
                            >
                               RETURN HOME
                            </Button>
                        </div>
                    </div>
                </div>
                </div>
        </>
    );

};

export default EndGame;
