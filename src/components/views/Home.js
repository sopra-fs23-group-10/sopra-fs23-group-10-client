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

    const gameModes = {text: "TEXT", image: "IMAGE", none: "NONE"};
    const playerModes = {single: "SINGLE", duel: "DUEL", none: "NONE"};

    const history = useHistory();

    const [users, setUsers] = useState(null);
    const [userIdInput, setUserIdInput] = useState('');
    const [startGame, setStartGame] = useState(false);
    const [gameMode, setGameMode] = useState(gameModes.none);
    const [playerMode, setPlayerMode] = useState(playerModes.none)

    const invite = async () => {
        try {
            const response = await inviteUser(userIdInput, "TEXT", "DUEL");
        } catch (error) {
            console.log(`user ${userIdInput} is not online`);
        }
    }

    const start = () => {
        setStartGame(true);
    }

    const chooseGameMode = (gm) => {
        setGameMode(gm);
    }

    const choosePlayerMode = (pm) => {
        console.log("set player mode");
        setPlayerMode(pm);
        if (pm === playerModes.duel) {
            history.push("/challenge/" + gameMode.toLowerCase());
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

    const startGameMenu = () => {
        if (!startGame) {
            return (
                <button onClick={() => start()} className='home start-game-button'>
                    <p className='home start-game'>Start Game</p>
                </button>
            );
        } else if (gameMode === gameModes.none) {
            return (    
                <>       
                    <button onClick={() => chooseGameMode(gameModes.text)} className='home start-game-button'>
                        <p className='home start-game'>Trivia</p>
                    </button>
                    <button onClick={() => chooseGameMode(gameModes.image)} className='home start-game-button'>
                        <p className='home start-game'>Image</p>
                    </button>
                </> 
            );
        } else {
            return (
                <>       
                <button onClick={() => choosePlayerMode(playerModes.duel)} className='home start-game-button'>
                    <p className='home start-game'>Duel</p>
                </button>
                <button onClick={() => choosePlayerMode(playerModes.single)} className='home start-game-button'>
                    <p className='home start-game'>Single</p>
                </button>
            </> 
            );
        }
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
                </BaseContainer>
                <div className='home start-game-container'>
                    {startGameMenu()}
                </div>
            </div>
        </div>
    );
}

export default Home;
