import React, {useState} from 'react';
//import {api, handleError} from 'helpers/api';
import {useHistory, Link} from 'react-router-dom';
//import {Button} from 'components/ui/Button';
import 'styles/views/PopUp.scss';
import BaseContainer from "components/ui/BaseContainer";
import {FormField} from "components/ui/FormField";
import HomeHeader from "./HomeHeader";
import {Button} from "../ui/Button";


const Ranking = props => {
    const history = useHistory();
    return (
        <>
            <HomeHeader height="100"/>
            <BaseContainer className="popup container">
                <div className ="title" style={{textAlign: "center"}}>
                    <p>
                        <strong> STAR PLAYERS </strong> <br />
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
