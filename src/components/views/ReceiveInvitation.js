import {Button} from 'components/ui/Button';
import {fetchUserById, answerInvite} from 'helpers/restApi';
import "styles/views/HomeHeader.scss";
import React,{useEffect,useState} from 'react';
import {connect} from "../../helpers/WebSocketFactory";
import "styles/views/PopUp.scss";
import "styles/ui/Invitation.scss";
import Invitation from "../../models/Invitation";
import {useHistory} from 'react-router-dom';


const ReceiveInvitation = props => {
    const history = useHistory;
    const [invitation, setInvitation] = useState(null);
    const [username, setUsername] = useState("");

    useEffect(() => {
        connect(handleInvite);
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

    const reply = async (accepted) => {
        const response = await answerInvite(invitation.id, accepted);
        const answer = Object.values(response)[0];
        if (answer) {
            setInvitation(null);
            history.push("/game")
        } else {
            setInvitation(null);
        }
    }

    const receiveInvitation = () => {
        if (invitation) {
            return (
                <>
                    <div className="invitation overlay">
                    </div>
                    <div className="invitation base-container">
                        <p>{username} has challenged you to a {invitation.quizType === "IMAGE" ? "image" : "trivia"} quiz!</p>
                        <div className="twoButtons button-container">
                            <Button onClick={() => reply(false)}>Decline</Button>
                            <Button onClick={() => reply(true)}>Accept</Button>
                        </div>
                    </div>
                </>
            );
        }
    }

    return (
        <>{receiveInvitation()}</> 
    );
};

export default ReceiveInvitation;
