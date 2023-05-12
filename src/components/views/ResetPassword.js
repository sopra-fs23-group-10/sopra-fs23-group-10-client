import React from 'react';
import 'styles/views/Registration.scss';
import BaseContainer from "components/ui/BaseContainer";
import {FormField} from "components/ui/FormField";
import {Button} from "../ui/Button";
import {Link} from "react-router-dom";
import HeaderAuthentication from "./HeaderAuthentication";
import { resetPassword } from 'helpers/restApi';
import { useState } from 'react';
import check from "images/checkmark.svg";


const ResetPassword = props => {
    const [email, setEmail] = useState(null);
    const [sent, setSent] = useState(false);

    const sendPassword = async () => {
        const response = await resetPassword(email);
        console.log(response);
        if (response) setSent(true);
    }

    const content = () => {
        if (!sent) {
            return (
                <>
                    <div className ="title" style={{textAlign: "center"}}>
                        <p>
                            Please enter your email get a new password.<br />
                        </p>
                    </div>
                    <FormField
                        label="email"
                        onChange={email => setEmail(email)}
                    />
                    <div className="popup button-container">
                        <Button
                            width="100%"
                            onClick={() => sendPassword()}
                        >
                            Send password
                        </Button>
                    </div>
                </>
            );
        } else {
            return (
                <div className='password-sent'>
                    <img style={{height:'20px', width:'20px'}} src={check}></img>
                    <p>New password has been sent!</p>
                </div>
            )
        }
    }

    return (
        <>
            <HeaderAuthentication height="100"/>
            <div className='challenge popup grid'>
                <Link to="/home" className='back'>✕ Cancel</Link>
                <BaseContainer className="popup container">
                    <div className='reset-password'>
                        {content()}
                    </div>
                </BaseContainer>
            </div>

        </>
    );
};


export default ResetPassword;
