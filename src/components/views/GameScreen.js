import GameHeader from "components/views/GameHeader";
import { GameButton } from "components/ui/GameButton";
import "styles/views/GameHeader.scss"
import "styles/views/GameScreen.scss"
import { useEffect, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";
import { sendAnswer } from "helpers/restApi";
import { Timer } from "components/ui/Timer";

const GameScreen = () => {
    const history = useHistory();
    const [question, setQuestion] = useState(null);
    const [answered, setAnswered] = useState(false);
    const [time, setTime] = useState(0);
    const answerTime = 10;
    const { selecting } = useParams();
    const { gameMode } = useParams();

    useEffect( () => {
        function timeOut() {
            if (!answered) {
                console.log("send wrong answer");
                answer("stupid answer");
            }
            goToScore();
        }

        if (!question && localStorage.getItem('answered')) {
            console.log("ANSWERED");
            setAnswered(true);
        }

        if (!question) setQuestion(JSON.parse(localStorage.getItem('question')));
        document.addEventListener("timeOut", timeOut);
        document.addEventListener("receivedResult", handleEndResult);
        return () => {
            document.removeEventListener("timeOut", timeOut);
            document.removeEventListener("receivedResult", handleEndResult);
        }
    });

    const chooseAnswer = async (str) => {
        setAnswered(true);
        localStorage.setItem('answered', true);
        answer(str);
    }

    const answer = async (str) => {
        try {
            await sendAnswer(
                localStorage.getItem('gameId'), 
                localStorage.getItem('id'), 
                question.questionId,
                str,
                time
            );
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
                <GameButton key={str} callback={() => chooseAnswer(str)} text={str}/>
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

    const handleEndResult = (e) => {
        if (selecting != 'selecting') {
            console.log(e.detail)
            localStorage.setItem('result', JSON.stringify(e.detail));
            history.push('/endgame/' + gameMode + "/waiting");
        }
    }

    const goToScore = () => {
        let nr = parseInt(localStorage.getItem('question_nr'));
        localStorage.removeItem('answered');
        localStorage.removeItem('question');
        localStorage.removeItem('startTime');
        if (nr < 1) {
            localStorage.setItem('question_nr', (nr + 1));
            history.push('/topic-selection/' + gameMode + "/" + (selecting == 'selecting' ? 'waiting' : 'selecting'));
        } else if (selecting == 'selecting') {
            history.push('/endgame/' + gameMode + "/" + selecting);
        }
    }

    const getTime = (time) => {
        setTime(time);
    }

    return (
        <>
            <GameHeader questionId={localStorage.getItem('question_nr')} showCancelButton={true} height="100"/>
            <div className="GameScreenGrid">
                {drawQuestion()}
                <Timer timeLimit={answerTime} getTime={getTime}/>
            </div>
        </>
    );
}

export default GameScreen;

