import React, {useState} from 'react';
//import {api, handleError} from 'helpers/api';
//import {useHistory, Link} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Registration.scss';
import BaseContainer from "components/ui/BaseContainer";
import {FormField} from "components/ui/FormField";
import {useHistory} from "react-router-dom";


const Rules = props => {
    const history = useHistory();
    return (
        <>
            <BaseContainer className="registration container">
                <FormField
                    label="GAME RULES"
                />
            </BaseContainer>
            <Button
                width="100%"
                onClick={() => history.push('/home')}
            >
                DONE
            </Button>
        </>
    );
};


export default Rules;
