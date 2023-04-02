import PropTypes from "prop-types";
import {generatePath, Link} from 'react-router-dom';
import "styles/ui/Player.scss";

const Player = ({user}) => (
    <Link
        className="player container"
        to={{pathname:generatePath('/users/:userId', {userId: user.id})}}>
        <img className="player profile-picture" src={user.profilePicture}></img>
        <div className="player username">{user.username}</div>
        <div className="player rank">{user.points ? user.points : 100}</div>
    </Link>
);

Player.propTypes = {
    user: PropTypes.object
};

export default Player;