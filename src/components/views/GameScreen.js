import GameHeader from "components/views/GameHeader";
import { GameButton } from "components/ui/GameButton";
import "styles/views/Home.scss";
import "styles/views/GameHeader.scss"
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from "react-router-dom";
import { getQuestion, sendAnswer } from "helpers/restApi";
import Question from "../../models/Question";
import BaseContainer from "components/ui/BaseContainer";

const GameScreen = () => {
    const [question, setQuestion] = useState(null);
    const location = useLocation();
    const history = useHistory();
    const [startTime, setStartTime] = useState(0);
    const [answered, setAnswered] = useState(false);

    useEffect( () => {
        async function fetchQuestion() {
            try {
                const response = await getQuestion(localStorage.getItem('gameId'), location.state.topic);
                console.log(response);
                const q = new Question(response);
                setQuestion(q);
                setStartTime(Date.now());
            } catch (error) {
                alert(error);
                history.push("/login");
            }
        }
        if (location.state.turn) fetchQuestion();
    }, []);

    const answer = async (str) => {
        try {
            const time = Date.now() - startTime;
            const response = await sendAnswer(
                localStorage.getItem('gameId'), 
                localStorage.getItem('userId'), 
                question.id,
                str,
                time
            );
            console.log(response);
            setAnswered(true);
        } catch (error) {
            alert(error);
            history.push("/login");
        }
    }

    const drawQuestion = () => {
        if (answered) {
            return <BaseContainer>Answer sent!</BaseContainer>
        } else if (question) {
            let answers = question.allAnswers.map((str) => 
                <GameButton callback={() => answer(str)} text={str}/>
            );
            return (
                <>
                    <BaseContainer>{question.question}</BaseContainer>
                    {answers}
                </>
            );
        }
    }

    return (
        <>
            <GameHeader height="100"/>
            {drawQuestion()}
        </>
    );
}

export default GameScreen;

