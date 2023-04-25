import React from 'react';
import {useHistory} from 'react-router-dom';
import 'styles/views/PopUp.scss';
import BaseContainer from "components/ui/BaseContainer";
import HomeHeader from "./HomeHeader";
import {Button} from "../ui/Button";
import ReceiveInvitation from './ReceiveInvitation';


const Ranking = props => {
    const history = useHistory();
    return (
        <>
            <ReceiveInvitation/>
            <HomeHeader height="100"/>
            <BaseContainer className="popup container">
                <div className ="title" style={{textAlign: "center"}}>
                    <p>
                        <strong> STAR PLAYERS </strong> <br />
                        <br />
                        this feature will follow in the second sprint<br />
 
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


export default Ranking;
