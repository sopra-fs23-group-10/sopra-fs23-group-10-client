import React from 'react';
import 'styles/views/Registration.scss';
import BaseContainer from "components/ui/BaseContainer";
import HomeHeader from "./HomeHeader";
import {Button} from "../ui/Button";
import {useHistory} from "react-router-dom";
import {FormField} from "../ui/FormField";


const ForgotPassword = props => {
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
                <FormField
                    label="Write down your e-mail, and we'll send you a new password"
                />

                <div className="twoButtons">
                    <Button
                        width="80%"
                        style={{margin: "auto"}}
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


export default ForgotPassword;
