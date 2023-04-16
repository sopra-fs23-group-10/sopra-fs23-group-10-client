import GameHeader from "components/views/GameHeader";
import { GameButton } from "components/ui/GameButton";
import "styles/views/Home.scss";
import "styles/views/GameHeader.scss"
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from "react-router-dom";
import { getQuestion } from "helpers/restApi";
import Question from "../../models/Question";

const GameScreen = () => {
    const [question, setQuestion] = useState(null);
    const location = useLocation();
    const history = useHistory();

    useEffect( () => {
        // TODO: find endpoint
        async function fetchQuestion() {
            try {
                const response = await getQuestion(location.state.topic, localStorage.getItem("gameId"));
                const q = new Question(response);
                setQuestion(q);
            } catch (error) {
                alert(error);
                history.push("/login");
            }
        }
        // fetchQuestion();
    });

    const drawQuestion = () => {
        if (question) {
            return (
                <div>question</div>
            );
        }
    }

    return (
        <>
            <GameHeader height="100"/>
        </>
    );
}

export default GameScreen;

