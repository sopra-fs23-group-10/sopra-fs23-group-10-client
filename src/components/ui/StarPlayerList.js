import PropTypes from "prop-types";
import "styles/ui/PlayerList.scss";
import StarPlayer from "../ui/StarPlayer";
import React, {useEffect, useState} from 'react';
import {fetchUserById, fetchUsers} from "helpers/restApi";
import { useHistory } from "react-router-dom";
import User from "../../models/User";
import Identicon from "react-identicons";


export const StarPlayerList = props => {
    const history = useHistory;
    const [users, setUsers] = useState(null);
    const [rank, setRank] = useState(null);
    const [username, setUsername] = useState(null);
    const [points, setPoints] = useState(null);
    const [currentUserId, setCurrentUserId] =useState(null);
    const [profilePicture, setProfilePicture] =useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const userData = await fetchUserById(localStorage.getItem('id'));
                const myUser = new User(userData);
                setUsername(myUser.username);
                setPoints(myUser.points);
                setRank(myUser.rank);
                setCurrentUserId(myUser.id);
                setProfilePicture(myUser.profilePicture);
            } catch (error) {
                history.push("/login");
            }
        }
        fetchData().catch(error => {
            console.error(error);
        });
    }, []);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetchUsers();
                setUsers(response.data);
                if (props.callback) props.callback(response.data);
            } catch (error) {
                history.push("/login");
            }
        }
        fetchData().catch(error => {
            console.error(error);
        });
    }, []);

    let userList = <div>waiting</div>;
    let starPlayers = [];

    if (users) {
        userList = (
            <ul className="user-list">
                {users.map((user) => {
                    if (user.id === currentUserId) {
                        return (
                            <div className="highlight-background" key={user.id}>
                                <StarPlayer user={user} key={user.id} action={props.action} />
                            </div>
                        );
                    } else {
                        return (
                            <StarPlayer user={user} key={user.id} action={props.action} />
                        );
                    }
                })}
            </ul>
        );
    }

    return (
        <>
            {userList}
            {rank < 1 || rank > 10 ? (
                <div className="StarPlayer container own-user" style={{ backgroundColor: 'lightgrey', borderRadius: '12px'}}>
                    <div className="StarPlayer rank">#{rank}</div>
                    <div style={{ height: '20px' }}></div>
                    <Identicon className="StarPlayer profile-picture" string={profilePicture} />
                    <div className="StarPlayer username">{username}</div>
                    <div className="StarPlayer points">POINTS: {points}</div>
                </div>
            ) : (
                <div>
                </div>
            )}
        </>
    );
};



StarPlayerList.propTypes = {
    callback: PropTypes.func,
    action: PropTypes.func,
    charNr: PropTypes.number
};