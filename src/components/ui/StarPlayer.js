import PropTypes from "prop-types";
import "styles/ui/StarPlayer.scss";
import Identicon from 'react-identicons';

const StarPlayer = ({user, charNr}) => {
    const shortenName = (name, n) => {
        return (name.length > n) ? name.slice(0, n-1) + '...' : name;
    }

    return (
        <div className="StarPlayer container">
            <div className="StarPlayer rank">#{user.rank}</div>
            <div style ={{height: '20px'}}> </div>
            <Identicon className="player profile-picture" {user.profilePicture}/>
            <div className="StarPlayer username">{shortenName(user.username, charNr)}
            </div>
            <div className="StarPlayer points">POINTS: {user.points}
            </div>
        </div>
    );

}

StarPlayer.propTypes = {
    user: PropTypes.object,
    action: PropTypes.func,
    charNr: PropTypes.number
};

export default StarPlayer;