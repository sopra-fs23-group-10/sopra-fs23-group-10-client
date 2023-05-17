import PropTypes from "prop-types";
import "styles/ui/Player.scss";
import Identicon from 'react-identicons';

const Player = ({user, action, charNr}) => {
    const shortenName = (name, n) => {
        return (name.length > n) ? name.slice(0, n-1) + '...' : name;
    }

    return (
        <div
            className="player container" onClick={action ? () => action(user.id) : null}>
            <Identicon className="player profile-picture" string={user.username}/>
            <div className="player username">{shortenName(user.username, charNr)}
                <div style ={{height: '20px'}}> </div>
            </div>
            <div className="player points">POINTS: {user.points}
                <div className="player rank">#{user.rank}</div>
            </div>

        </div>
    );

}

Player.propTypes = {
    user: PropTypes.object,
    action: PropTypes.func,
    charNr: PropTypes.number
};

export default Player;