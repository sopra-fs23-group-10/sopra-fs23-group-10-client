import React from 'react';
import 'styles/views/Registration.scss';
import BaseContainer from "components/ui/BaseContainer";
import {FormField} from "components/ui/FormField";
import HomeHeader from "./HomeHeader";
import {Button} from "../ui/Button";


const ResetPassword = props => {

    return (
        <>
            <HomeHeader height="100"/>
            <BaseContainer className="popup container">
                <div className ="title" style={{textAlign: "center"}}>
                    <p>
                        CHANGE PASSWORD <br />
                    </p>
                </div>
                <FormField
                    label="Old Password"
                />
                <FormField
                    label="New Password"
                />
                <FormField
                    label="Confirm New Password"
                />
                <div className="popup button-container">
                    <Button
                        // disabled={!username || !password}
                        width="100%"
                        //onClick={() => doLogin()}
                    >
                        SET PASSWORD
                    </Button>
                </div>
            </BaseContainer>
        </>
    );
};


export default ResetPassword;
