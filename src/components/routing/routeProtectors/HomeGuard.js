import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";
import { cancelGame } from "helpers/restApi";

export const HomeGuard = props => {
  const startMusic = () => {
    const event = new CustomEvent('playingChange', { detail: true });
    document.dispatchEvent(event);
  }

  const cancel = async (id) => {
    await cancelGame(id);
  }

  const cleanup = () => {
    localStorage.removeItem('gameId');
    localStorage.removeItem('question_nr');
    localStorage.removeItem('topics');
    localStorage.removeItem('sentAnswer');
    localStorage.removeItem('correctAnswer');
    localStorage.removeItem('startTime');
    localStorage.removeItem('result');
    localStorage.removeItem('topic');
    localStorage.removeItem('answered');
    localStorage.removeItem('invitation');
    localStorage.removeItem('bothAnswered');
  }

  if (localStorage.getItem('gameId')) {
    cancel(localStorage.getItem('gameId')).catch(error => {
      console.error(error);
    });
    cleanup();
    return props.children;
  } else if (localStorage.getItem("token")){
    startMusic();
    return props.children;
  } else {
    return <Redirect to="/login"/>;
  }
};

HomeGuard.propTypes = {
  children: PropTypes.node
};