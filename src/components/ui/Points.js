import "styles/ui/Points.scss";
import BaseContainer from "./BaseContainer";
import PropTypes from "prop-types";

export const Points = props => (
  <BaseContainer>
    <div className="username">{props.user}</div>
    <div className="points">{props.points}</div>
  </BaseContainer>
);

Points.propTypes = {
  user: PropTypes.string,
  points: PropTypes.number
};