import GameHeader from "components/views/GameHeader";
import { GameButton } from "components/ui/GameButton";
//import "styles/views/Home.scss";
import "styles/views/GameHeader.scss"
import "styles/views/GameScreen.scss"
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from "react-router-dom";
import { getQuestion, sendAnswer } from "helpers/restApi";
import Question from "../../models/Question";
import BaseContainer from "components/ui/BaseContainer";
import { Timer } from "components/ui/Timer";

const GameScreen = () => {
    const [question, setQuestion] = useState(null);
    const location = useLocation();
    const history = useHistory();
    const [answered, setAnswered] = useState(false);
    const [time, setTime] = useState(0);

    useEffect( () => {
        async function fetchQuestion() {
            try {
                const response = await getQuestion(localStorage.getItem('gameId'), location.state.topic);
                console.log(response);
                const q = new Question(response);
                setQuestion(q);
            } catch (error) {
                alert(error);
                history.push("/login");
            }
        }
        if (location.state.turn) fetchQuestion();
    }, []);

    const answer = async (str) => {
        try {
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
            return (
                    <>
                        <div className="background-question">
                            <div className="question-content" style={{textAlign: "center"}}>
                                Answer sent!
                            </div>
                        </div>
                    </>

                )
        } else if (question) {
            let answers = question.allAnswers.map((str) =>
                <GameButton callback={() => answer(str)} text={str}/>
            );
            return (
                <>
                    <div className="background-question">
                        <div className="question-content" style={{textAlign: "center"}}>
                            {question.question}
                        </div>
                    </div>

                    <div className ="QuestionGrid">
                        <div className="answer-1">{answers[0]}</div>
                        <div className="answer-2">{answers[1]}</div>
                        <div className="answer-3">{answers[2]}</div>
                        <div className="answer-4">{answers[3]}</div>
                    </div>
                </>
            );
        }
    }

    const timerDone = () => {
        const nr = location.state.nr++;
        history.push({
            pathname: '/topic-selection',
            search: '?update=true',
            state: {
                turn: location.state.turn, //CHANGE TO TOGGLE WHEN WEBSOCKETS!
                nr: nr,
                finished: nr >= 10,
            },
        });
    }

    const getTime = (time) => {
        setTime(time);
    }

    return (
        <>
            <GameHeader questionId={location.state.nr} height="100"/>;
            <div className="GameScreenGrid">
                {drawQuestion()}
                <Timer timeLimit={2000} timeOut={() => timerDone()} getTime={() => getTime()}/>
            </div>

        </>
    );
}

export default GameScreen;

