import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";
import { cancelGame } from "helpers/restApi";

/**
 * routeProtectors interfaces can tell the router whether or not it should allow navigation to a requested route.
 * They are functional components. Based on the props passed, a route gets rendered.
 * In this case, if the user is authenticated (i.e., a token is stored in the local storage)
 * {props.children} are rendered --> The content inside the <HomeGuard> in the App.js file, i.e. the user is able to access the main app.
 * If the user isn't authenticated, the components redirects to the /login screen
 * @Guard
 * @param props
 */
export const HomeGuard = props => {
  const cancel = async (id) => {
    await cancelGame(id);
  }

  if (localStorage.getItem('gameId')) {
    cancel(localStorage.getItem('gameId'));
    localStorage.removeItem('gameId');
    localStorage.removeItem('question_nr');
    localStorage.removeItem('topics');
    localStorage.removeItem('sentAnswer');
    localStorage.removeItem('correctAnswer');
    localStorage.removeItem('startTime');
    localStorage.removeItem('result');
    localStorage.removeItem('topic');
    return props.children;
  } else if (localStorage.getItem("token")){
    return props.children;
  } else {
    return <Redirect to="/login"/>;
  }
};

HomeGuard.propTypes = {
  children: PropTypes.node
};