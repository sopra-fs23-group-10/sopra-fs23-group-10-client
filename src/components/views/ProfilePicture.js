import React, {useEffect, useState} from 'react';
import {fetchUserById} from 'helpers/restApi';
import User from 'models/User';
import {Link, useHistory, useParams} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/UserProfile.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import HomeHeader from "./HomeHeader";
import ReceiveInvitation from './ReceiveInvitation';
import 'styles/views/PopUp.scss';
import 'styles/views/ProfilePicture.scss';
import Identicon from "react-identicons";
import { updateUser } from '../../helpers/restApi';
import user from "models/User";
import {Timer} from "../ui/Timer";


const UserProfile = props => {
    const history = useHistory();
    const [username, setUsername] = useState(null);
    const [profilePicture, setProfilePicture] = useState(null);
    const [msg, setMsg] = useState("");

    let { user_id } = useParams();

    console.log(user_id);

    useEffect(() => {
        async function fetchData() {
            try {
                const userData = await fetchUserById(user_id);
                const user = new User(userData);
                setUsername(user.username);
                setProfilePicture(user.profilePicture);
            } catch (error) {
                console.error(error.message);
                alert("Something went wrong while fetching the user data! See the console for details.");
            }
        }
        fetchData();
    }, []);

    const randomNr = () => {
        const nr = Math.floor(Math.random() * 10 + 1);
        return nr;
    }

    const randomString =() => {
        let string = '';
        const stringLength = randomNr();
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        for ( let i = 0; i < stringLength; i++ ) {
            string += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return string;
    }

    const randomStringList = () => {
        let stringList = [];
        const numStrings = 9;
        for (let i = 0; i< numStrings; i++){
            stringList.push(randomString());
        }
        return stringList;
    }

    const stringList = randomStringList();

    const changeProfilePicture = async () => {
            try {
                setMsg("");
                await updateUser (user_id, username, profilePicture);
                history.push('/home');
            } catch (error) {
                console.log(error);
                if (error.response.status === 409) { setMsg("Sorry, but the username is taken"); }
                else {
                    alert(error);
                }
            }
        }


    const PictureClick = () => {
            return (
                <>
                <div className="invitation overlay"></div>
                <div className="invitation base-container">
                    <p>
                        <strong> Do you want to change your profile picture to: </strong>

                    </p>
                    <Identicon className="profile-picture" string={profilePicture} size={190}/>
                    <div className="twoButtons button-container">
                        <Button onClick={() => changeProfilePicture()}> Yes </Button>
                        <Button onClick={() => history.push('/home')}>No</Button>
                    </div>
                </div>
            </>)
        }

    return (
        <>
            <ReceiveInvitation/>
            <HomeHeader height="100"/>
            <BaseContainer className="popup container">
                <div className = "title-location" style={{ gridColumn: '1 / span 2', textAlign: 'center' }} >
                    <div className="title"> <strong> CHANGE PROFILE PICTURE </strong></div>
                </div>
                <div className="ProfilePicture container" >
                    {stringList.map((str, index) => (
                        <Identicon key={index} className="profile-picture" string={str} size={190} onClick={() => PictureClick(str)}/>
                    ))}
                </div>
                <Button
                    width="100%"
                    style={{marginTop: "12px"}}
                    onClick={() => history.push('/home')}
                >
                    Go Back
                </Button>
            </BaseContainer>
        </>

    );
}

export default UserProfile;