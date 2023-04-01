import PropTypes from "prop-types";
import {generatePath, Link} from 'react-router-dom';

const Player = ({user}) => (
    <div className="player container">
        <Link
            to={{pathname:generatePath('/users/:userId', {userId: user.id})}}
            style={{textDecoration: 'none', color: 'inherit'}}>
            <div className="player username">
                {user.username}
            </div>
        </Link>
            <div className="player name">{user.name}</div>
        <div className="player id">id: {user.id}</div>
    </div>
);

Player.propTypes = {
    user: PropTypes.object
};

export default Player;