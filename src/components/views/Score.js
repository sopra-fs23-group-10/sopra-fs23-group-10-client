import GameHeader from "components/views/GameHeader";
import "styles/views/Score.scss"
import { getIntermediateResults, getTopicSelection, fetchUserById } from "helpers/restApi";
import {useEffect, useState} from 'react';
import { useHistory, useLocation } from "react-router-dom";
import { GameButton } from "components/ui/GameButton";
import { Points } from "components/ui/Points";
import Result from "../../models/Result";
import BaseContainer from "components/ui/BaseContainer";
import { Timer } from "components/ui/Timer";


const Score = props => {
    const history = useHistory();
    const location = useLocation();
    const [topics, setTopics] = useState(null);
    const [result, setResult] = useState(null);
    const [usernameInviting, setUsernameInviting] = useState("");
    const [usernameInvited, setUsernameInvited] = useState("");
    const [time, setTime] = useState(0);

    useEffect(() => {
        async function fetchTopics() {
            try {
                const response = await getTopicSelection(localStorage.getItem("gameId"));
                setTopics(response.topics);
            } catch (error) {
                alert(error);
                history.push("/login");
            }
        }

        async function fetchGame() {
            try {
                const response = await getIntermediateResults(localStorage.getItem("gameId"));
                const res = new Result(response);
                setResult(res);
                await getUser(response.invitingPlayerId, setUsernameInviting);
                await getUser(response.invitedPlayerId, setUsernameInvited);
            } catch (error) {
                alert(error);
                history.push("/login");
            }
        }

        const getUser = async(id, callback) => {
            try {
                const userData = await fetchUserById(id);
                callback(userData.username);
            } catch (error) {
                alert(error);
            }
        }

        if (location.state.turn) fetchTopics();
        fetchGame();
    }, []);

    const parseString = (str) => {
        return str.replace('_', ' & ');
    }

    const toQuestion = (str) => {
        history.push({
            pathname: '/game',
            search: '?update=true',
            state: {
                turn: location.state.turn, 
                topic: str
            },
        });
    }

    const rndTopic = () => {
        let rnd = getRandomInt(0, 3);
        toQuestion(topics[rnd]); 
    }
    
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
    }

    const getTime = (time) => {
        setTime(time);
    }

    const drawTopics = () => {
        if (location.state.turn && topics) {
            let topicItems = topics.map((topic) => 
                <GameButton callback={() => toQuestion(topic)} text={parseString(topic)}/>
            );

            return (
                <>
                    {topicItems}
                    <Timer timeLimit={15} timeOut={() => rndTopic()} getTime={() => getTime()}/>
                </>
            );
        } else if (!location.state.turn) {
            return (
                <BaseContainer>Your opponent is selecting a topic.</BaseContainer>
            );
        }
    }

    const drawResults = () => {
        console.log(result);
        if (result && usernameInvited && usernameInviting) {
            return (
                <div>
                    <Points user={usernameInviting} points={result.invitingPlayerResult}/>
                    <Points user={usernameInvited} points={result.invitedPlayerResult}/>
                </div>
            );
        }
    }

    return (
        <>
            <GameHeader height="100"/>
            {drawResults()}
            {drawTopics()}
        </>
    );
}

export default Score;
