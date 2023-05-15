import GameHeader from "components/views/GameHeader";
import { GameButton } from "components/ui/GameButton";
import "styles/views/GameHeader.scss"
import "styles/views/GameScreen.scss"
import { useEffect, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";
import { sendAnswer } from "helpers/restApi";
import { Timer } from "components/ui/Timer";
import star from "images/star.png";
import BaseContainer from "components/ui/BaseContainer";

const GameScreen = () => {
    const history = useHistory();
    const [question, setQuestion] = useState(null);
    const [sentAnswer, setSentAnswer] = useState(null);
    const [correctAnswer, setCorrectAnswer] = useState(null);
    const [time, setTime] = useState(0);
    const answerTime = 10;
    const { selecting } = useParams();
    const { gameMode, playerMode } = useParams();
    const nQuestions = parseInt(localStorage.getItem('total_questions'));
    const [timeoutId, setTimeoutId] = useState(null);

    useEffect(() => {
        function timeOut() {
            if (sentAnswer) {
                setCorrectAnswer(localStorage.getItem('correctAnswer'));
                let id = setTimeout(() => {
                    goToScore();
                }, 3000);
                setTimeoutId(id);
            } else {
                answer("stupid answer", false).catch(error => {
                    console.error(error);
                });
            }
        }

        if (!question && localStorage.getItem('sentAnswer')) {
            setSentAnswer(localStorage.getItem('sentAnswer'));
        }

        if (!question && localStorage.getItem('correctAnswer')) {
            setCorrectAnswer(localStorage.getItem('correctAnswer'));
        }

        if (!question) {
            setQuestion(JSON.parse(localStorage.getItem('question')));
        }
        
        document.addEventListener("timeOut", timeOut);
        document.addEventListener("receivedResult", handleEndResult);
        document.addEventListener("cancelled", handleCancelled);
        return () => {
            document.removeEventListener("timeOut", timeOut);
            document.removeEventListener("receivedResult", handleEndResult);
            document.removeEventListener("cancelled", handleCancelled);
        }
    });

    const chooseAnswer = async (str) => {
        answer(str, playerMode == 'duel').catch(error => {
            console.error(error);
        });
    }

    const answer = async (str, wait) => {
        try {
            setSentAnswer(str);
            localStorage.setItem('sentAnswer', str);
            const response = await sendAnswer(
                localStorage.getItem('gameId'), 
                localStorage.getItem('id'), 
                question.questionId,
                str,
                time
            );
            console.log(response);
            localStorage.setItem('correctAnswer', response.data.correctAnswer);
            if (response && !wait) {
                setCorrectAnswer(response.data.correctAnswer);
                const event = new CustomEvent('pause', { detail: null });
                document.dispatchEvent(event);
                let id = setTimeout(() => {
                    goToScore();
                }, 3000);
                setTimeoutId(id);
            }
        } catch (error) {
            alert(error);
            history.push("/login");
        }
    } 

    const drawQuestion = () => {
        if (correctAnswer) {
            console.log("correct answer = " + correctAnswer);
            let accent = (str) => {
                if (str == correctAnswer) return <img className="star accent" src={star}></img>;
            }
            let answers = question.allAnswers.map((str) => {
                    return (
                        <div key={str}>
                            {accent(str)}
                            <GameButton 
                            className={"inactive"}
                            selected={str == localStorage.getItem('sentAnswer')}
                            disabled={str != correctAnswer}
                            >
                                {str}
                            </GameButton>
                        </div>
                    );
                }
            );
            return (
                <div className ="QuestionGrid">
                    {answers}
                </div>
            );
        } else if (question) {
            let content;
            if (sentAnswer) {
                content = (
                    <div className="background-answerSent">
                        <div className="answerSent-content" style={{textAlign: "center"}}>
                            Answer sent!
                        </div>
                    </div>
                );
            } else {
                let answers = question.allAnswers.map((str) =>
                    <GameButton key={str} callback={() => chooseAnswer(str)}>{str}</GameButton>
                );
                content = (
                    <>
                        <div className={`background-question ${gameMode == 'image' ? 'image-question' : ''}`}>
                            <div style={{display:gameMode == 'text' ? "none": "block"}} className="image-question-bg"></div>
                            <div className='question-content' style={{textAlign: "center"}}>
                                {question.question}
                            </div>
                        </div>
                        <div className ="QuestionGrid">
                            {answers}
                        </div>
                    </>
                );
            }
            return (
                <>
                    {content}
                    <Timer timeLimit={answerTime} getTime={getTime}/>
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

    const handleCancelled = (e) => {
        console.log("handle cancelled, timeoutId: " + timeoutId);
        if (timeoutId) clearTimeout(timeoutId);
    }

    const goToScore = () => {
        let nr = parseInt(localStorage.getItem('question_nr'));
        console.log("current q: " + nr + ", total qs: " + nQuestions);
        cleanup();
        if (nr < nQuestions) {
            localStorage.setItem('question_nr', (nr + 1));
            history.push('/topic-selection/' + playerMode + '/' + gameMode + "/" + (selecting == 'selecting' && playerMode != 'single' ? 'waiting' : 'selecting'));
        } else if (selecting == 'selecting') {
            history.push('/endgame/' + playerMode + '/' + gameMode + "/" + selecting);
        }
    }

    const getTime = (time) => {
        setTime(time/1000);
    }

    const resultText = () => {
        if (sentAnswer == correctAnswer) return "Correct!"
        else if (sentAnswer == "stupid answer") return "Time out!"
        else return "False!"
    }

    const showResult = () => {
        if (correctAnswer) return <div className={`display ${gameMode == 'image' ? 'image-question' : ''}`}>{resultText()}</div>
    }

    const showImage = () => {
        if (gameMode == "image" && question) {
            return (
                <BaseContainer className="image-holder">
                    <img style={{filter: `blur(${correctAnswer ? 0 : 20*(time/answerTime)}px)`}} src={`https://imgur.com/${question.apiId}.jpeg`} ></img>
                </BaseContainer>
            );
        }
    }

    return (
        <>
            <GameHeader playerMode={playerMode} questionId={localStorage.getItem('question_nr')} showCancelButton={true} height="100"/>
            <div className="GameScreenGrid">
                {showResult()}
                {showImage()}
                {drawQuestion()}
            </div>
        </>
    );
}

export default GameScreen;

