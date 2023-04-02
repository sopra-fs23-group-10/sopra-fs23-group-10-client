import React, {useState} from 'react';
//import {api, handleError} from 'helpers/api';
import {useHistory, Link} from 'react-router-dom';
//import {Button} from 'components/ui/Button';
import 'styles/views/UserPopUp.scss';
import BaseContainer from "components/ui/BaseContainer";
import {FormField} from "components/ui/FormField";


const Ranking = props => {
    return (
        <>
            <div className="label-container">
                <Link to="/home" style={{textAlign: "left"}}> BACK </Link>
            </div>
            <BaseContainer className="userpopup container">
                <div className ="title" style={{textAlign: "center"}}>
                    STAR PLAYERS
                </div>
            </BaseContainer>
        </>
    );
};


export default Ranking;
