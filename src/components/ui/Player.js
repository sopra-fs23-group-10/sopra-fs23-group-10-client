import PropTypes from "prop-types";
import "styles/ui/Player.scss";

const Player = ({user, action}) => (
    <div
        className="player container" onClick={action ? () => action(user.id) : null}>
        <img className="player profile-picture" src={user.profilePicture}></img>
        <div className="player username">{user.username}</div>
        <div className="player rank">{user.points ? user.points : 100}</div>
    </div>
);

Player.propTypes = {
    user: PropTypes.object,
    action: PropTypes.func
};

export default Player;