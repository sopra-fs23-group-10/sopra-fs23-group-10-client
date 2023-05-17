import React, {useEffect, useState} from 'react';
import {answerInvite, createGame} from 'helpers/restApi';
import {Link, useHistory, useParams} from 'react-router-dom';
import 'styles/views/PopUp.scss';
import BaseContainer from "components/ui/BaseContainer";
import HomeHeader from "./HomeHeader";
import {Button} from "../ui/Button";
import {PlayerList} from 'components/ui/PlayerList';
import 'styles/views/ChallengePlayer.scss';
import {Timer} from 'components/ui/Timer';
import 'styles/ui/Invitation.scss';
import ReceiveInvitation from './ReceiveInvitation';

const ChallengePlayer = props => {
    const history = useHistory();
    const { gameMode } = useParams();
    const [users, setUsers] = useState(null);
    const [inviteSent, setInviteSent] = useState(false);

    useEffect(() => {
        function handleAnswer(e) {
            if (inviteSent) {
                const accepted = JSON.parse(e.detail)[localStorage.getItem('gameId')];
                console.log("handle answer, id: " + localStorage.getItem('gameId'));
                if (accepted) {
                    localStorage.setItem('question_nr', 0);
                    localStorage.removeItem('startTime');
                    history.push(`/topic-selection/duel/${gameMode}/waiting`);
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
            const response = await createGame(id, gameMode.toUpperCase(), "DUEL");
            localStorage.setItem('gameId', response.gameId);
            setInviteSent(true);
        } catch (error) {
            history.push("/home");
            alert(error);
        }
    }

    const cancelInvite = async () => {
        try {
            localStorage.setItem("answered", true);
            await answerInvite(localStorage.getItem('gameId'), false);
            localStorage.removeItem('gameId');
            setInviteSent(false);
        } catch (error) {
            history.push("/home");
            alert(error);
        }
    }

    const chooseOpponent = (id) => {
        invite(id).catch(error => {
            console.error(error);
        });
    }

    function cryptoRandom() {
        const typedArray = new Uint8Array(1);
        const randomValue = crypto.getRandomValues(typedArray)[0];
        return randomValue / Math.pow(2, 8);
    }

    const challengeRandomUser = () => {
        const id = localStorage.getItem('id');
        const others = users.filter(user => user.id != parseInt(id));
        const rnd = cryptoRandom();
        invite(others[rnd].id).catch(error => {
            console.error(error);
        });
    }

    const sentInvitation = () => {
        if (inviteSent) {
            return (
                <div className='invite-sent'>
                    <div className="invitation overlay">
                    </div>
                    <div className="invitation base-container">
                        {invitationContent()}
                    </div>
                </div>
            );
        }
    }

    const invitationContent = () => {
        return (
            <>
                <a onClick={cancelInvite} style={{textAlign: "right"}}> Cancel Invitation</a>
                <div className="p" style={{textAlign: "center"}}>
                    Invite has been sent. Waiting for answer...
                </div>
                <div className="button-container font-black">
                    <Timer timeLimit={60} timeOut={cancelInvite}/>
                </div>
            </>
        );
    }

    return (
        <>
            {sentInvitation()}
            <HomeHeader height="100"/>
            <ReceiveInvitation/>
            <div className='challenge popup grid'>
                <Link to="/home" className='back'>✕ Cancel</Link>
                <BaseContainer className="popup container">
                    <div className="rulesGrid">
                        <div className ="title_location" style={{textAlign: "center"}}>
                            <h3> Challenge Player </h3>
                        </div>
                        <div className="content_location">
                            <PlayerList callback={getUsers} action={chooseOpponent} charNr={40}/>
                        </div>
                        <div className='fade'></div>
                        <div className='fade-top'></div>
                        <div className="button_location">
                            <Button
                                width="100%"
                                onClick={() => challengeRandomUser()}
                                disabled={users == null}
                            >
                                Random
                            </Button>
                        </div>
                    </div>
                </BaseContainer>
            </div>
        </>
    );
};


export default ChallengePlayer;
