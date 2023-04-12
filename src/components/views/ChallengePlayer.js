import React from 'react';
//import {api, handleError} from 'helpers/api';
import {useHistory, useParams} from 'react-router-dom';
//import {Button} from 'components/ui/Button';
import 'styles/views/PopUp.scss';
import BaseContainer from "components/ui/BaseContainer";
import HomeHeader from "./HomeHeader";
import {Button} from "../ui/Button";


const ChallengePlayer = props => {
    const history = useHistory();
    const { gameMode } = useParams();

    return (
        <>
            <HomeHeader height="100"/>
            <BaseContainer className="popup container">
                <div className ="title" style={{textAlign: "center"}}>
                    <p>
                       {gameMode}<br />
                    </p>
                </div>
                <div className="button-container">
                    <Button
                        width="100%"
                        onClick={() => history.push('/home')}
                    >
                        BACK
                    </Button>
                </div>
            </BaseContainer>
        </>
    );
};


export default ChallengePlayer;
