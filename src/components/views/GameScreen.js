import GameHeader from "components/views/GameHeader";
import { GameButton } from "components/ui/GameButton";
//import "styles/views/Home.scss";
import "styles/views/GameHeader.scss"
import "styles/views/GameScreen.scss"
import { useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from "react-router-dom";
import { getQuestion, sendAnswer } from "helpers/restApi";
import Question from "../../models/Question";
import BaseContainer from "components/ui/BaseContainer";
import { Timer } from "components/ui/Timer";
import { subscribe, unsubscribe } from "helpers/events";

const GameScreen = () => {
    const [question, setQuestion] = useState(null);
    const location = useLocation();
    const history = useHistory();
    const [answered, setAnswered] = useState(false);
    const [time, setTime] = useState(0);
    const answerTime = 15;

    useEffect( () => {
        subscribe('timeOut', () => timeOut());
        setQuestion(location.state.question);
        return () => {
            unsubscribe('timeOut', () => timeOut());
        }
    }, [answered, question, time]);

    const answer = async (str, id, time) => {
        try {
            const response = await sendAnswer(
                localStorage.getItem('gameId'), 
                localStorage.getItem('id'), 
                id,
                str,
                time
            );
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
                        <div className="background-answerSent">
                            <div className="answerSent-content" style={{textAlign: "center"}}>
                                Answer sent!
                            </div>
                        </div>
                    </>

                );
        } else if (question) {
            let answers = question.allAnswers.map((str) =>
                <GameButton callback={() => answer(str, question.id, time)} text={str}/>
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

    const timeOut = () => {
        console.log("timer done, answered: " + answered);
        console.log("send wrong answer");
        if (!answered) {
            answer("stupid answer", question.id, time);
        }
        goToScore();
    }

    const goToScore = () => {
        let nr = parseInt(localStorage.getItem('question_nr'));
        if (nr < 4) {
            localStorage.setItem('question_nr', (nr + 1));
            localStorage.setItem('selecting', !(localStorage.getItem('selecting') === "true"));
            history.push('/topic-selection');
        } else {
            history.push('/endgame');
        }
    }

    const getTime = (time) => {
        setTime(time);
    }

    return (
        <>
            <GameHeader questionId={localStorage.getItem('question_nr')} height="100"/>
            <div className="GameScreenGrid">
                {drawQuestion()}
                <Timer timeLimit={answerTime} getTime={getTime}/>
            </div>
        </>
    );
}

export default GameScreen;

