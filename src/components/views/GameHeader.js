import React from "react";
import PropTypes from "prop-types";
import "styles/views/GameHeader.scss";

/**
 * This is an example of a Functional and stateless component (View) in React. Functional components are not classes and thus don't handle internal state changes.
 * Conceptually, components are like JavaScript functions. They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen.
 * They are reusable pieces, and think about each piece in isolation.
 * Functional components have to return always something. However, they don't need a "render()" method.
 * https://reactjs.org/docs/components-and-props.html
 * @FunctionalComponent
 */
const GameHeader = props => (
    <header className="gameheader container">
        <div className="gamecontentheader fontnormal" style={{textAlign: "left"}}>
            <p>
                DuelMode <br />
                Trivia Quiz
            </p>
        </div>
        <div className="gamecontentheader fontnormal" style={{textAlign: "left"}}>
            <p>
                Score <br />
                {props.questionId}/10
            </p>
        </div>
        <div className="content" style={{textAlign: "right"}}>
            Music
        </div>
    </header>
);

GameHeader.propTypes = {
    height: PropTypes.number,
    questionId: PropTypes.string
};



/**
 * Don't forget to export your component!
 */
export default GameHeader;
