import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import {useHistory, Link} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Registration.scss';
import BaseContainer from "components/ui/BaseContainer";
import {FormField} from "components/ui/FormField";


const Ranking = props => {
    return (
        <>
            <div className="label-container">
                <Link to="/home" style={{textAlign: "left"}}> BACK </Link>
            </div>
            <BaseContainer className="registration container">
                STAR PLAYERS
            </BaseContainer>
        </>
    );
};


export default Ranking;
