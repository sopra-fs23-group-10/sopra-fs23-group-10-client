import PropTypes from "prop-types";
import "styles/ui/StarPlayer.scss";
import Identicon from 'react-identicons';

const StarPlayer = ({user}) => (
    <div className="StarPlayer container">
        <div className="StarPlayer rank">#{user.rank}</div>
        <div style ={{height: '20px'}}> </div>
        <Identicon className="player profile-picture" string={user.username}/>
        <div className="StarPlayer username">{user.username}
        </div>
        <div className="StarPlayer points">POINTS: {user.points}
        </div>
    </div>
);

StarPlayer.propTypes = {
    user: PropTypes.object,
    action: PropTypes.func
};

export default StarPlayer;