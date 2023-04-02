import React, {useState} from 'react';
import 'styles/views/Registration.scss';
import BaseContainer from "components/ui/BaseContainer";
import {FormField} from "components/ui/FormField";
import HomeHeader from "./HomeHeader";
import HeaderAuthentication from "./HeaderAuthentication";
import {Button} from "../ui/Button";
import {useHistory} from "react-router-dom";


const ResetPassword = props => {
    const history = useHistory();
    return (
        <>
            <HomeHeader height="100"/>
            <BaseContainer className="popup container">
                <div className ="title" style={{textAlign: "center"}}>
                    <p>
                        Do you want to reset your password? <br />
                    </p>
                </div>
                <div className="twoButtons">
                    <Button
                        width="80%"
                        style={{margin: "auto"}}
                        //onClick={() => history.push('/home')}
                    >
                        RESET
                    </Button>
                    <Button
                        width="80%"
                        style={{margin: "auto"}}
                        onClick={() => history.push('/login')}
                    >
                        GO BACK
                    </Button>
                </div>
            </BaseContainer>
        </>
    );
};


export default ResetPassword;
