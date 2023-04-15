import React from 'react';
import {useState} from 'react';
import {inviteUser} from 'helpers/restApi';
//import {api, handleError} from 'helpers/api';
import {useHistory, useParams, Link} from 'react-router-dom';
//import {Button} from 'components/ui/Button';
import 'styles/views/PopUp.scss';
import BaseContainer from "components/ui/BaseContainer";
import HomeHeader from "./HomeHeader";
import {Button} from "../ui/Button";
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
            console.log(response);
        } catch (error) {
            alert(error);
        }
    }

    const chooseOpponent = (id) => {
        invite(id);
    }

    const challengeRandomUser = () => {
        const id = localStorage.getItem('id');
        const others = users.filter(user => user.id !== id);
        const rnd = Math.floor(Math.random() * others.length);
        invite(others[rnd].id);
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
                            Random
                        </Button>
                    </div>
                </BaseContainer>
            </div>
        </>
    );
};


export default ChallengePlayer;
