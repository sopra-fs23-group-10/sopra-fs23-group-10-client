import React, {useEffect, useState} from 'react';
import {fetchUserById} from 'helpers/restApi';
import User from 'models/User';
import {Link, useHistory, useParams} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import HomeHeader from "./HomeHeader";
import ReceiveInvitation from './ReceiveInvitation';
import 'styles/views/PopUp.scss';
import 'styles/views/ProfilePicture.scss';
import Identicon from "react-identicons";
import { updateUser } from '../../helpers/restApi';
import { cryptoRandom } from '../../helpers/utility';

const ProfilePicture= props => {
    const history = useHistory();
    const [username, setUsername] = useState(null);
    const [originalPicture, setoriginalPicture] = useState (null);
    const [msg, setMsg] = useState("");
    const [selectedPicture, setSelectedPicture] = useState(null);
    const [showPopUp, setPopUp] = useState(false);


    let { user_id } = useParams();
    console.log(user_id);

    useEffect(() => {
        async function fetchData() {
            try {
                const userData = await fetchUserById(user_id);
                const user = new User(userData);
                setUsername(user.username);
                setoriginalPicture(user.profilePicture);
            } catch (error) {
                console.error(error.message);
                alert("Something went wrong while fetching the user data! See the console for details.");
            }
        }
        fetchData().catch(error => {
            console.error(error);
        });
    }, []);

    const randomString =() => {
        let string = '';
        const stringLength = cryptoRandom(10);
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        for ( let i = 0; i < stringLength; i++ ) {
            try {
                string += characters.charAt(cryptoRandom(characters.length - 1) % characters.length);
            } catch (error){
                console.error('An error occurred while generating the random string:', error);
            }
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

    const [stringList, setStringList] = useState(randomStringList());

    const PictureClick = (str) => {
        console.log(str);
        setSelectedPicture(str);
        setPopUp(true);
    }

    const ClosePopUp =() =>{
        setPopUp(false);
    }

    const Change = ()  => {
        if (showPopUp){
            return (
                <>
                    <div className="PictureChange overlay">
                        <div className="PictureChange base-container">
                            <strong> Do you want to change your profile picture to: </strong>
                            <Identicon className="profile-picture" string={selectedPicture} size={100} />
                            <div className="twoButtons button-containerPP">
                                <Button onClick={() => changeProfilePicture()}> Yes </Button>
                                <Button onClick={() => {ClosePopUp()}}>No</Button>
                            </div>
                        </div>
                    </div>

                </>)
        }
    }



    const changeProfilePicture = async () => {
        try {
            await updateUser (user_id, username, selectedPicture);
            history.push('/home');
        } catch (error) {
            console.log(error);
            if (error.response.status === 409) { setMsg("Sorry, please try again later"); }
            else {
                alert(error);
            }
        }
    }

    return (
        <>

            <HomeHeader height="100"/>
            <BaseContainer className="popup container">
                <div className = "title-location" style={{ gridColumn: '1 / span 2', textAlign: 'center' }} >
                    <div className="title"> <strong> CHOOSE A NEW PROFILE PICTURE </strong></div>
                </div>
                <div className="ProfilePicture container">
                    {stringList.map((str, index) => (
                        <div onClick ={() => PictureClick(str)}>
                            <Identicon className="pictures" string={str} size={100} />
                        </div>
                    ))}
                </div>
                {Change()}
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

export default ProfilePicture;