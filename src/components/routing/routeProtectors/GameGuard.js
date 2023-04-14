import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";

export const GameGuard = props => {
    console.log("gamId");
    console.log(localStorage.getItem("gameId"));
  if (localStorage.getItem("gameId")) {
    console.log("hello");
    return props.children;
  } else if (!localStorage.getItem("token")) {
    return <Redirect to="/login"/>;
  } else {
    return <Redirect to="/home"/>;
  }
};

GameGuard.propTypes = {
  children: PropTypes.node
};