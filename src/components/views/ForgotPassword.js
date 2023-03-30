import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import {useHistory, Link} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Registration.scss';
import BaseContainer from "components/ui/BaseContainer";
import {FormField} from "components/ui/FormField";


const ForgotPassword = props => {
    return (
        <>
            <BaseContainer className="registration container">
                <FormField
                    label="Forgot Password Page"
                />
            </BaseContainer>
        </>
    );
};


export default ForgotPassword;
