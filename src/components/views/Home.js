import {useEffect, useState} from 'react';
import {fetchUsers, inviteUser, logoutUser} from 'helpers/restApi';
import {Button} from 'components/ui/Button';
import {generatePath, Link, useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import HomeHeader from "components/views/HomeHeader";
import "styles/views/Home.scss";
import SockJS from "sockjs-client";
import {Stomp} from "@stomp/stompjs";
import axios from "axios";


const Player = ({user}) => (
    <div className="player container">
        <Link
            to={{pathname:generatePath('/users/:userId', {userId: user.id})}}
            style={{textDecoration: 'none', color: 'inherit'}}>
            <div className="player username">
                {user.username}
            </div>
        </Link>
            <div className="player name">{user.name}</div>
        <div className="player id">id: {user.id}</div>
    </div>
);

Player.propTypes = {
    user: PropTypes.object
};

const Home = () => {

    const history = useHistory();

    const [users, setUsers] = useState(null);

    const logout = async () => {
        const response = await logoutUser(history);
    }

    useEffect(() => {

        const BASE_URL = 'http://localhost:8080';
        const socketFactory = () => new SockJS(`${BASE_URL}/ws`);

        async function connect() {
            const id = localStorage.getItem('id');
            const stompClient = Stomp.over(socketFactory());
            stompClient.debug = (message) => {
                console.log(message);
            };

            stompClient.reconnect_delay = 5000;
            stompClient.onWebSocketError = (error) => {
                console.error('WebSocket error:', error);
                setTimeout(() => {
                    connect();
                }, stompClient.reconnect_delay);
            };
            stompClient.onWebSocketClose = () => {
                console.error('WebSocket closed');
                setTimeout(() => {
                    connect();
                }, stompClient.reconnect_delay);
            };

            stompClient.connect({}, () => {
                stompClient.subscribe(`/invitations/${id}`, (message) => {
                    console.log(`Received message: ${message.body}`);
                    alert("Server says: " + message.body);
                });
            });

            axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
            axios.defaults.headers.post['Content-Type'] = 'application/json';
            axios.defaults.baseURL = BASE_URL;
        };


        // TODO: remove prototype
        async function invite() {
            try {
                const response = await inviteUser(1, "TEXT", "DUEL");
            } catch (error) {
                console.log("user 2 is not online");
            }
        };


        async function fetchData() {
            try {
                const response = await fetchUsers();
                setUsers(response.data);
            } catch (error) {
                history.push("/login");
            }
        }
        fetchData();
        connect();
        invite();
    }, []);

    let userList = <div>waiting</div>;

    if (users) {
        userList = (
            <div className="game">
                <ul className="game user-list">
                    {users.map(user => (
                        <Player
                            user={user}
                            key={user.id}
                        />
                    ))}
                </ul>
                <Button
                  width="100%"
                  onClick={() => logout()}
                >
                    Logout
                </Button>
            </div>
        );
    }

    return (
        <>
            <HomeHeader height="100"/>
            <BaseContainer>
                <h2>Welcome!</h2>
                <p className="game paragraph">
                    Get all users from secure endpoint:
                </p>
                {userList}
            </BaseContainer>
        </>
    );
}

export default Home;
