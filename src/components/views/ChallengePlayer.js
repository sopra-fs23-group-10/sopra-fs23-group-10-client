import React from 'react';
import {useState, useEffect} from 'react';
import {inviteUser, answerInvite} from 'helpers/restApi';
//import {api, handleError} from 'helpers/api';
import {useHistory, useParams, Link} from 'react-router-dom';
//import {Button} from 'components/ui/Button';
import 'styles/views/PopUp.scss';
import BaseContainer from "components/ui/BaseContainer";
import HomeHeader from "./HomeHeader";
import {Button} from "../ui/Button";
import { PlayerList } from 'components/ui/PlayerList';
import 'styles/views/ChallengePlayer.scss';
import { Timer } from 'components/ui/Timer';
import 'styles/ui/Invitation.scss';
import ReceiveInvitation from './ReceiveInvitation';

const ChallengePlayer = props => {
    const history = useHistory();
    const { gameMode } = useParams();
    const [users, setUsers] = useState(null);
    const [inviteSent, setInviteSent] = useState(false);
    const [time, setTime] = useState(0);

    useEffect(() => {
        function handleAnswer(e) {
            if (inviteSent) {
                const accepted = JSON.parse(e.detail)[localStorage.getItem('gameId')];
                if (accepted) {
                    localStorage.setItem('question_nr', 1);
                    localStorage.removeItem('startTime');
                    history.push(`/topic-selection/${gameMode}/waiting`);
                } else {
                    localStorage.removeItem('gameId');
                    setInviteSent(false);
                }
            }
        }

        document.addEventListener("receiveReply", handleAnswer);
        return () => {
            document.removeEventListener("receiveReply", handleAnswer);
        } 
    }, [inviteSent])

    const getUsers = async (u) => {
        setUsers(u);
    }

    const invite = async (id) => {
        try {
            const response = await inviteUser(id, gameMode.toUpperCase(), "DUEL");
            localStorage.setItem('gameId', response.gameId);
            setInviteSent(true);
        } catch (error) {
            history.push("/home");
            alert(error);
        }
    }

    const cancelInvite = async () => {
        try {
            const response = await answerInvite(localStorage.getItem('gameId'), false);
            localStorage.removeItem('gameId');
            setInviteSent(false);
        } catch (error) {
            history.push("/home");
            alert(error);
        }
    }

    const chooseOpponent = (id) => {
        invite(id);
    }

    const challengeRandomUser = () => {
        const id = localStorage.getItem('id');
        const others = users.filter(user => user.id != parseInt(id));
        const rnd = Math.floor(Math.random() * others.length);
        invite(others[rnd].id);
    }

    const getTime = (time) => {
        setTime(time);
    }

    const sentInvitation = () => {
        if (inviteSent) {
            return (
                <div className='invite-sent'>
                    <div className="invitation overlay">
                    </div>
                    <div className="invitation base-container">
                        <a onClick={cancelInvite} style={{textAlign: "right"}}> Cancel Invitation</a>
                        <div className="p" style={{textAlign: "center"}}>
                            Invite has been sent. Waiting for answer...
                        </div>
                        <div className="button-container">
                            <Timer timeLimit={60} timeOut={cancelInvite} getTime={getTime}/>
                        </div>
                    </div>
                </div>
            );
        }
    }

    return (
        <>
            {sentInvitation()}
            <HomeHeader height="100"/>
            <ReceiveInvitation/>
            <div className='challenge popup grid'>
                <Link to="/home" className='back'>✕ Cancel</Link>
                <BaseContainer className="popup container">
                    <h3 className='popup title'>Challenge Player</h3>
                    <PlayerList callback={getUsers} action={chooseOpponent}/>
                    <div className="button-container">
                        <Button
                            width="100%"
                            onClick={() => challengeRandomUser()}
                            disabled={users == null}
                        >
                            Random
                        </Button>
                    </div>
                </BaseContainer>
            </div>
        </>
    );
};


export default ChallengePlayer;
