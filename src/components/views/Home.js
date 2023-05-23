import {useState} from 'react';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import HomeHeader from "components/views/HomeHeader";
import "styles/views/Home.scss";
import {SelectionButton} from "components/ui/SelectionButton.js";
import image from "images/image.png";
import trivia from "images/trivia.png";
import duel from "images/duel.png";
import single from "images/single.png";
import star from "images/star.png";
import {PlayerList} from "../ui/PlayerList";
import ReceiveInvitation from './ReceiveInvitation';
import { createGame, handleError } from 'helpers/restApi';

const Home = () => {

    const gameModes = {text: "TEXT", image: "IMAGE", none: "NONE"};
    const playerModes = {single: "SINGLE", duel: "DUEL", none: "NONE"};

    const history = useHistory();

    const [startGame, setStartGame] = useState(false);
    const [gameMode, setGameMode] = useState(gameModes.none);
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
        if (pm === playerModes.duel && users.length < 2) return;
        if (pm === playerModes.duel) {
            history.push("/challenge/" + gameMode.toLowerCase());
        }

        if (pm === playerModes.single) {
            newGame().catch(error => {
                console.error(error);
            });
        }
    }

    const startGameMenu = () => {
        if (users) {
            if (!startGame) {
                return (
                    <div className='home start-container boing-intro'>
                        <img className='star' src={star}></img>
                        <button onClick={() => start()} className='home start-game-button'>
                            <p className='home start-game'>Start Game</p>
                        </button>
                    </div>
                );
            } else if (gameMode === gameModes.none) {
                return (    
                    <>      
                        <div className="selection-container" onClick={() => chooseGameMode(gameModes.text)}>
                            <SelectionButton 
                                className="game"
                                title={"Trivia\nQuiz"}
                                url={trivia}
                                >
                            </SelectionButton>
                        </div>
                        <div className="selection-container" onClick={() => chooseGameMode(gameModes.image)}>
                            <SelectionButton 
                                className="game"
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
                        <div className="selection-container" onClick={() => choosePlayerMode(playerModes.duel)}>
                            <SelectionButton
                                className="player"
                                title={"Duel\nMode"}
                                url={duel}
                                inactive={users.length < 2}
                                >
                            </SelectionButton>
                        </div>
                        <div className="selection-container" onClick={() => choosePlayerMode(playerModes.single)}>
                            <SelectionButton 
                                className="player"
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

    async function newGame() {
        try {
            console.log("new game");
            const response = await createGame(0, gameMode.toUpperCase(), 'SINGLE');
            console.log(response);
            localStorage.setItem('gameId', response.gameId);
            if (response) {
                if (gameMode == gameModes.text){
                    history.push("/single-topic-selection/" + gameMode.toLowerCase());
                } else {
                    history.push("/single-image-start/" + gameMode.toLowerCase());
                }
            }
        } catch (error) {
            alert(`Something went wrong while creating a new game, ${handleError(error)}`);
        }
    }

    return (
        <div className="fill">
            <HomeHeader/>
            <ReceiveInvitation/>
            <div className='home container'>
                <BaseContainer className="home user-container bounce-intro">
                    <h3>Active Users</h3>
                    <div className='scroll-container'>
                        <PlayerList callback={getUsers} charNr={10}/>
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
