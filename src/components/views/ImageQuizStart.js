import {useHistory, useParams} from 'react-router-dom';
import "styles/views/Home.scss";
import { Timer } from 'components/ui/Timer';
import { getImageQuestion } from 'helpers/restApi';
import GameHeader from './GameHeader';
import 'styles/views/Score.scss';

const ImageQuizStart = () => {
    let { gameMode } = useParams();
    const history = useHistory();

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

    return (
        <>
            <GameHeader showCancelButton={true} gameMode={gameMode} questionId={localStorage.getItem('question_nr')} playerMode="single" height="100"></GameHeader>
            <div className='ScreenGrid-Score'>
                <div className='display'>Get Ready!</div>
                <div></div>
                <div className='font-white'>
                    <Timer timeLimit={5} timeOut={fetchQuestion}></Timer>
                </div>
            </div>
        </>

    );
}

export default ImageQuizStart;
