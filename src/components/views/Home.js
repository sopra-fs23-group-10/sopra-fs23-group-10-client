import {useEffect, useState} from 'react';
import {fetchUsers, logoutUser} from 'helpers/restApi';
import {Button} from 'components/ui/Button';
import {generatePath, Link, useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import HomeHeader from "components/views/HomeHeader";
import "styles/views/Home.scss";


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

const Home = () => {
    // use react-router-dom's hook to access the history
    const history = useHistory();

    // define a state variable (using the state hook).
    // if this variable changes, the component will re-render, but the variable will
    // keep its value throughout render cycles.
    // a component can have as many state variables as you like.
    // more information can be found under https://reactjs.org/docs/hooks-state.html
    const [users, setUsers] = useState(null);

    const logout = async () => {
        const response = await logoutUser();
        history.push('/login');
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetchUsers();
                setUsers(response.data);
            } catch (error) {
                history.push("/login");
            }
        }
        fetchData();
    }, []);

    let userList = <div>waiting</div>;

    if (users) {
        userList = (
            <div className="game">
                <ul className="game user-list">
                    {users.map(user => (
                        <Player
                            user={user}
                            ey={user.id}
                        />
                    ))}
                </ul>
                <Button
                  width="100%"
                  onClick={() => logout()}
                >
                    Logout
                </Button>
            </div>
        );
    }

    return (
        <>
            <HomeHeader height="100"/>
            <BaseContainer>
                <h2>Welcome!</h2>
                <p className="game paragraph">
                    Get all users from secure endpoint:
                </p>
                {userList}
            </BaseContainer>
        </>
    );
}

export default Home;
