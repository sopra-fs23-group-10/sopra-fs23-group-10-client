import {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import HomeHeader from "components/views/HomeHeader";
import "styles/views/Home.scss";
import {connect} from "../../helpers/WebSocketFactory";
import {SelectionButton} from "components/ui/SelectionButton.js";
import image from "images/image.png";
import trivia from "images/trivia.png";
import duel from "images/duel.png";
import single from "images/single.png";
import {PlayerList} from "../ui/PlayerList";

const Home = () => {

    const gameModes = {text: "TEXT", image: "IMAGE", none: "NONE"};
    const playerModes = {single: "SINGLE", duel: "DUEL", none: "NONE"};

    const history = useHistory();

    const [startGame, setStartGame] = useState(false);
    const [gameMode, setGameMode] = useState(gameModes.none);
    const [playerMode, setPlayerMode] = useState(playerModes.none)
    const [users, setUsers] = useState(null);

    const getUsers = (u) => {
        setUsers(u);
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

    const blabla = (msg) => {
        console.log("bi ba boop bi boopi boop");
        console.log(msg);
    }


    const startGameMenu = () => {
        if (users) {
            if (!startGame) {
                return (
                    <button onClick={() => start()} className='home start-game-button'>
                        <p className='home start-game'>Start Game</p>
                    </button>
                );
            } else if (gameMode === gameModes.none) {
                return (    
                    <>      
                        <div class="selection-container" onClick={() => chooseGameMode(gameModes.text)}>
                            <SelectionButton 
                                class="game"
                                title={"Trivia\nQuiz"}
                                url={trivia}
                                >
                            </SelectionButton>
                        </div>
                        <div class="selection-container" onClick={() => chooseGameMode(gameModes.image)}>
                            <SelectionButton 
                                class="game"
                                title={"Image\nQuiz"}
                                url={image}
                                >
                            </SelectionButton>
                        </div>
                    </> 
                );
            } else {
                return (
                    <> 
                        <div class="selection-container" onClick={() => choosePlayerMode(playerModes.duel)}>
                            <SelectionButton
                                class="player"
                                title={"Duel\nMode"}
                                url={duel}
                                inactive={users.length < 2}
                                >
                            </SelectionButton>
                        </div>
                        <div class="selection-container" onClick={() => choosePlayerMode(playerModes.single)}>
                            <SelectionButton 
                                class="player"
                                title={"Single\nMode"}
                                url={single}
                                >
                            </SelectionButton>
                        </div>
                    </> 
                );
            }
        }
    }

    return (
        <div className="fill">
            <HomeHeader/>
            <div className='home container'>
                <BaseContainer className="home user-container">
                    <div className='scroll-container'>
                        <h3>Active Users</h3>
                        <PlayerList callback={getUsers}/>
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
