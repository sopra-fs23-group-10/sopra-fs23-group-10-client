import React from 'react';
import {useEffect, useState} from 'react';
import {inviteUser} from 'helpers/restApi';
//import {api, handleError} from 'helpers/api';
import {useHistory, useParams, Link} from 'react-router-dom';
//import {Button} from 'components/ui/Button';
import 'styles/views/PopUp.scss';
import BaseContainer from "components/ui/BaseContainer";
import HomeHeader from "./HomeHeader";
import {Button} from "../ui/Button";
import {connect} from "../../helpers/WebSocketFactory";
import { PlayerList } from 'components/ui/PlayerList';
import 'styles/views/ChallengePlayer.scss';


const ChallengePlayer = props => {
    const history = useHistory();
    const { gameMode } = useParams();
    const [users, setUsers] = useState(null);

    const getUsers = async (u) => {
        setUsers(u);
    }

    const invite = async (id) => {
        try {
            const response = await inviteUser(id, gameMode.toUpperCase(), "DUEL");
        } catch (error) {
            console.log(`user ${id} is not online`);
        }
    }

    const chooseOpponent = (id) => {
        invite(id);
    }

    const challengeRandomUser = () => {
        const rnd = Math.floor(Math.random() * users.length);
        invite(users[rnd].id);
    }

    return (
        <>
            <HomeHeader height="100"/>
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
                            Challenge Random Player
                        </Button>
                    </div>
                </BaseContainer>
            </div>
        </>
    );
};


export default ChallengePlayer;
