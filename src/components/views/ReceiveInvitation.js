import {Button} from 'components/ui/Button';
import {fetchUserById, answerInvite} from 'helpers/restApi';
import "styles/views/HomeHeader.scss";
import React,{useEffect,useState} from 'react';
import {connectInvitations} from "../../helpers/WebSocketFactory";
import "styles/views/PopUp.scss";
import "styles/ui/Invitation.scss";
import Invitation from "../../models/Invitation";
import {useHistory} from 'react-router-dom';
import PropTypes from "prop-types";

const ReceiveInvitation = props => {
    const history = useHistory();
    const [invitation, setInvitation] = useState(null);
    const [username, setUsername] = useState("");

    useEffect(() => {
        console.log("CONNECT INVITATION");
        connectInvitations(handleInvite, handleAnswer);
    }, []);

    const handleInvite = async (msg) => {
        let obj = JSON.parse(msg);
        let inv = new Invitation(obj)
        getInvitingUser(inv.invitingUserId);
        setInvitation(inv);
    }

    const getInvitingUser = async(id) => {
        try {
            const userData = await fetchUserById(id);
            setUsername(userData.username);
        } catch (error) {
            alert(error);
        }
    }

    const handleAnswer = (msg) => {
        console.log("HANDLE ANSWER");
        console.log(msg);
        setInvitation(null);
        setUsername("");
        if (props.onAnswer) props.onAnswer(msg);
    }

    const reply = async (accepted) => {
        const response = await answerInvite(invitation.id, accepted);
        if (response[invitation.id]) {
            setInvitation(null);
            goToGame();
        } else {
            setInvitation(null);
        }
    }

    const goToGame = () => {
        localStorage.setItem('gameId', invitation.id);
        history.push({
            pathname: '/topic-selection',
            search: '?update=true',  // query string
            state: {  // location state
                turn: true, 
                nr: 1,
                finished: false
            },
        });
    }

    const receiveInvitation = () => {
        if (invitation) {
            return (
                <div className='invitation-received'>
                    <div className="invitation overlay">
                    </div>
                    <div className="invitation base-container">
                        <p>{username} has challenged you to a {invitation.quizType === "IMAGE" ? "image" : "trivia"} quiz!</p>
                        <div className="twoButtons button-container">
                            <Button onClick={() => reply(false)}>Decline</Button>
                            <Button onClick={() => reply(true)}>Accept</Button>
                        </div>
                    </div>
                </div>
            );
        }
    }

    return (
        <>{receiveInvitation()}</> 
    );
};

ReceiveInvitation.propTypes = {
    onAnswer: PropTypes.func
};

export default ReceiveInvitation;
