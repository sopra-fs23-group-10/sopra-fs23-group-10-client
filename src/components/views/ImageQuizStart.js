import {useHistory, useParams} from 'react-router-dom';
import "styles/views/Home.scss";
import { Timer } from 'components/ui/Timer';
import { getImageQuestion } from 'helpers/restApi';
import GameHeader from './GameHeader';
import 'styles/views/Score.scss';
import { useState } from 'react';

const ImageQuizStart = () => {
    let { gameMode } = useParams();
    const history = useHistory();
    const [time, setTime] = useState(3);

    localStorage.setItem('question_nr', 0);

    const fetchQuestion = async () => {
        try {
            const response = await getImageQuestion(localStorage.getItem('gameId'));
            toQuestion(response);
        } catch (error) {
            alert(error);
            localStorage.removeItem('topics');
            history.push("/login");
        }
    }

    const toQuestion = (question) => {
        localStorage.removeItem('startTime');
        localStorage.setItem('question', JSON.stringify(question));
        let nr = parseInt(localStorage.getItem('question_nr'));
        localStorage.setItem('question_nr', (nr + 1));
        history.push('/game/single/' + gameMode + "/selecting");
    }

    const getTime = (t) => {
        setTime(Math.floor(t/1000));
    }

    return (
        <>
            <GameHeader showCancelButton={true} gameMode={gameMode} questionId={localStorage.getItem('question_nr')} playerMode="single" height="100"></GameHeader>
            <div className='ScreenGrid-Score'>
                <div className='display bobbing'>Get Ready!</div>
                <div style={{fontSize:"400px", lineHeight:"400px"}} className='display pulse-animation'>{time}</div>
                <div className='font-white'>
                    <Timer display={false} timeLimit={3} getTime={getTime} timeOut={fetchQuestion}></Timer>
                </div>
            </div>
        </>

    );
}

export default ImageQuizStart;
