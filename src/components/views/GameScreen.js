import GameHeader from "components/views/GameHeader";
import { GameButton } from "components/ui/GameButton";
import "styles/views/GameHeader.scss"
import "styles/views/GameScreen.scss"
import { useEffect, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";
import { sendAnswer } from "helpers/restApi";
import { Timer } from "components/ui/Timer";
import star from "images/star.png";

const GameScreen = () => {
    const history = useHistory();
    const [question, setQuestion] = useState(null);
    const [sentAnswer, setSentAnswer] = useState(null);
    const [correctAnswer, setCorrectAnswer] = useState(null);
    const [time, setTime] = useState(0);
    const answerTime = 30;
    const { selecting } = useParams();
    const { gameMode, playerMode } = useParams();
    const nQuestions = 4;

    useEffect( () => {
        function timeOut() {
            if (sentAnswer == null) {
                answer("stupid answer");
            }
            goToScore();
        }

        if (!question && localStorage.getItem('sentAnswer')) {
            setSentAnswer(localStorage.getItem('sentAnswer'));
        }

        if (!question && localStorage.getItem('correctAnswer')) {
            setCorrectAnswer(localStorage.getItem('correctAnswer'));
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
        setSentAnswer(str);
        localStorage.setItem('sentAnswer', str);
        answer(str);
    }

    const answer = async (str) => {
        try {
            const response = await sendAnswer(
                localStorage.getItem('gameId'), 
                localStorage.getItem('id'), 
                question.questionId,
                str,
                time
            );
            console.log(response);
            localStorage.setItem('correctAnswer', response.data.correctAnswer);
            setCorrectAnswer(response.data.correctAnswer);
            if (response && playerMode == "single") {
                const event = new CustomEvent('pause', { detail: null });
                document.dispatchEvent(event);
                setTimeout(() => {
                    goToScore();
                }, 3000);
            }
        } catch (error) {
            alert(error);
            history.push("/login");
        }
    } 

    const drawQuestion = () => {
        if (sentAnswer && correctAnswer) {
            console.log("correct answer = " + correctAnswer);
            let accent = (str) => {
                if (str == correctAnswer) return <img className="star accent" src={star}></img>;
            }
            let answers = question.allAnswers.map((str) => {
                    return (
                        <div key={str}>
                            {accent(str)}
                            <GameButton className={ "inactive " + 
                                (str == sentAnswer ? "selected " : "") +
                                (str != correctAnswer ? "disabled" : "")
                                } >
                                {str}
                            </GameButton>
                        </div>
                    );
                }
            );
            return (
                    <>
                        <div className ="QuestionGrid">
                            {answers}
                        </div>
                    </>
                );
        } else if (question) {
            let answers = question.allAnswers.map((str) =>
                <GameButton key={str} callback={() => chooseAnswer(str)}>{str}</GameButton>
            );
            return (
                <>
                    <div className="background-question">
                        <div className="question-content" style={{textAlign: "center"}}>
                            {question.question}
                        </div>
                    </div>

                    <div className ="QuestionGrid">
                        {answers}
                    </div>
                </>
            );
        }
    }

    const cleanup = () => {
        localStorage.removeItem('sentAnswer');
        localStorage.removeItem('correctAnswer');
        localStorage.removeItem('question');
        localStorage.removeItem('startTime');
    }

    const handleEndResult = (e) => {
        let nr = parseInt(localStorage.getItem('question_nr'));
        if (selecting != 'selecting' && nr >= nQuestions) {
            cleanup();
            localStorage.setItem('result', JSON.stringify(e.detail));
            history.push('/endgame/duel/' + gameMode + "/waiting");
        }
    }

    const goToScore = () => {
        let nr = parseInt(localStorage.getItem('question_nr'));
        cleanup();
        if (nr < nQuestions) {
            localStorage.setItem('question_nr', (nr + 1));
            history.push('/topic-selection/' + playerMode + '/' + gameMode + "/" + (selecting == 'selecting' && playerMode != 'single' ? 'waiting' : 'selecting'));
        } else if (selecting == 'selecting') {
            history.push('/endgame/' + playerMode + '/' + gameMode + "/" + selecting);
        }
    }

    const getTime = (time) => {
        setTime(time);
    }

    const showResult = () => {
        if (correctAnswer) return <div className="result">{correctAnswer == sentAnswer ? "Correct!" : "False!"}</div>
    }

    return (
        <>
            <GameHeader playerMode={playerMode} questionId={localStorage.getItem('question_nr')} showCancelButton={true} height="100"/>
            <div className="GameScreenGrid">
                {showResult()}
                {drawQuestion()}
                <Timer timeLimit={answerTime} getTime={getTime}/>
            </div>
        </>
    );
}

export default GameScreen;

