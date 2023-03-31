import {useEffect, useState} from 'react';
import {fetchUsers, inviteUser, logoutUser} from 'helpers/restApi';
import {Button} from 'components/ui/Button';
import {generatePath, Link, useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import HomeHeader from "components/views/HomeHeader";
import "styles/views/Home.scss";
import {connect} from "../../helpers/WebSocketFactory";


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
    const [userIdInput, setUserIdInput] = useState('');

    const logout = async () => {
        const response = await logoutUser(history);
    }

    const invite = async () => {
        try {
            const response = await inviteUser(userIdInput, "TEXT", "DUEL");
        } catch (error) {
            console.log(`user ${userIdInput} is not online`);
        }
    }

    useEffect(() => {

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
                <div className="invite-form">
                    <input
                        type="text"
                        value={userIdInput}
                        onChange={(e) => setUserIdInput(e.target.value)}
                        placeholder="Enter user ID"
                    />
                    <Button
                        onClick={invite}
                        disabled={!userIdInput}
                    >
                        Invite
                    </Button>
                </div>
            </BaseContainer>
        </>
    );
}

export default Home;
