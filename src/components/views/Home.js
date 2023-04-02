import {useEffect, useState} from 'react';
import {fetchUsers, inviteUser, logoutUser} from 'helpers/restApi';
import {Button} from 'components/ui/Button';
import {generatePath, Link, useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import HomeHeader from "components/views/HomeHeader";
import "styles/views/Home.scss";
import {connect} from "../../helpers/WebSocketFactory";
import Player from "components/ui/Player";

const Home = () => {

    const history = useHistory();

    const [users, setUsers] = useState(null);
    const [userIdInput, setUserIdInput] = useState('');

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
            <>
                <ul className="home user-list">
                    {users.map(user => (
                        <Player
                            user={user}
                            key={user.id}
                        />
                    ))}
                </ul>
            </>
        );
    }

    return (
        <div className="fill">
            <HomeHeader/>
            <div className='home container'>
                <BaseContainer className="home user-container">
                    <div className='scroll-container'>
                        <h3>Active Users</h3>
                        {userList}
                    </div>

                    
                    {/* 
                    TODO: Move to duel select
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
                    </div> */}

                </BaseContainer>
                <div className='home start-game-container'>
                    <button className='home start-game-button'>
                        <p className='home start-game'>Start Game</p>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Home;
