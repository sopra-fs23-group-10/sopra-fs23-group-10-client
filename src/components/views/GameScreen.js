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
import { connectRound, disconnectRound } from "helpers/WebSocketFactory";
import { FontResizer } from "components/ui/FontResizer";

const GameScreen = () => {
    const history = useHistory();
    const [question, setQuestion] = useState(null);
    const [sentAnswer, setSentAnswer] = useState(null);
    const [correctAnswer, setCorrectAnswer] = useState(null);
    const [time, setTime] = useState(0);
    const answerTime = 15;
    const { selecting } = useParams();
    const { gameMode, playerMode } = useParams();
    const nQuestions = parseInt(localStorage.getItem('total_questions'));
    const [bothAnswered, setBothAnswered] = useState(false);

    useEffect(() => {
        function handleBothAnswered() {
            console.log("HANDLe both answered");
            setBothAnswered(true);
            localStorage.setItem("bothAnswered", true);
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

        if (localStorage.getItem("bothAnswered")) setBothAnswered(true);
        
        if (playerMode == 'duel') connectRound(handleBothAnswered);
        document.addEventListener("receivedResult", handleEndResult);
        return () => {
            if (playerMode == 'duel') disconnectRound();
            document.removeEventListener("receivedResult", handleEndResult);
        }
    }, [question]);

    const chooseAnswer = async (str) => {
        answer(str).catch(error => {
            console.error(error);
        });
    }

    function timeOut() {
        console.log("TIME OUT");
        if (!localStorage.getItem('sentAnswer')) {
            console.log("TIME OUT, SEND ANSWER");
            answer("stupid answer", 0).catch(error => {
                console.error(error);
            });
        }
    }

    const answer = async (str, time) => {
        try {
            console.log("SEND ANSWER");
            setSentAnswer(str);
            localStorage.setItem('sentAnswer', str);
            console.log(localStorage.getItem('sentAnswer'));
            localStorage.removeItem("startTime");
            const question = JSON.parse(localStorage.getItem('question'));
            const response = await sendAnswer(
                localStorage.getItem('gameId'), 
                localStorage.getItem('id'), 
                question.questionId,
                str,
                time
            );
            console.log(response);
            localStorage.setItem('correctAnswer', response.data.correctAnswer);
            if (response) {
                setCorrectAnswer(response.data.correctAnswer);
                const pauseEvt = new CustomEvent('pause', { detail: null });
                document.dispatchEvent(pauseEvt);
                setCorrectAnswer(localStorage.getItem("correctAnswer"));
            }
        } catch (error) {
            alert(error);
            history.push("/login");
        }
    } 

    const drawQuestion = () => {
        if (correctAnswer) {
            let accent = (str) => {
                if (str == correctAnswer) return <img className="star accent" src={star}></img>;
            }
            let answers = question.allAnswers.map((str, index) => {
                    return (
                        <div key={str}>
                            {accent(str)}
                            <GameButton 
                            inactive={true}
                            selected={str == localStorage.getItem('sentAnswer')}
                            disabled={str != correctAnswer}
                            text={str}
                            delay={index/10}
                            ></GameButton>
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
                let answers = question.allAnswers.map((str, index) =>
                    <GameButton delay={index/10} key={str} className="boing-intro" callback={() => chooseAnswer(str)} text={str}></GameButton>
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
                    <div className="font-white">
                        <Timer timeLimit={answerTime} getTime={getTime} timeOut={timeOut}/>
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
        localStorage.removeItem('bothAnswered');
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
        console.log("go to score");
        let nr = parseInt(localStorage.getItem('question_nr'));
        cleanup();
        if (nr < nQuestions) {
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
        if (correctAnswer) return <div className='display'>{resultText()}</div>
    }

    const showImage = () => {
        if (gameMode == "image" && question) {
            return (
                <BaseContainer className="image-holder">
                    <div className="image" style={{filter: `blur(${correctAnswer ? 0 : 20*(time/answerTime)}px)`, background: `url(https://imgur.com/${question.apiId}.jpeg)`}}>
                    <FontResizer className="title-holder">
                        {showResult()}
                    </FontResizer>
                    </div>
                </BaseContainer>
            );
        }
    }

    const finishTimer = () => {
        if (bothAnswered || (playerMode == 'single' && correctAnswer)) {
            return (
                <Timer timeLimit={3} display={false} timeOut={() => goToScore()}/>
            )
        }
    }

    const showResultText = () => {
        console.log(gameMode == 'text');
        if (gameMode == 'text') {
            return showResult();
        }
    }

    return (
        <>
            <GameHeader playerMode={playerMode} gameMode={gameMode} questionId={localStorage.getItem('question_nr')} showCancelButton={true} height="100"/>
            <div className="GameScreenGrid">
                {showResultText()}
                {showImage()}
                {drawQuestion()}
                {finishTimer()}
            </div>
        </>
    );
}

export default GameScreen;