import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Button} from 'components/ui/Button';
import {generatePath, Link, useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
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
        const id = localStorage.getItem('id');
        const requestBody = JSON.stringify({id});
        await api.post('/logout', requestBody, {headers: {token: localStorage.getItem('token')}});

        localStorage.removeItem('token');
        localStorage.removeItem('id');
        history.push('/login');
    }

    // the effect hook can be used to react to change in your component.
    // in this case, the effect hook is only run once, the first time the component is mounted
    // this can be achieved by leaving the second argument an empty array.
    // for more information on the effect hook, please see https://reactjs.org/docs/hooks-effect.html
    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {
            try {
                const authToken = localStorage.getItem('token');
                const response = await api.get('/users', {headers: {token: authToken}});

                // Get the returned users and update the state.
                setUsers(response.data);

                // This is just some data for you to see what is available.
                // Feel free to remove it.
                console.log('request to:', response.request.responseURL);
                console.log('status code:', response.status);
                console.log('status text:', response.statusText);
                console.log('requested data:', response.data);

            // See here to get more data.
                console.log(response);
            } catch (error) {
                console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the users! See the console for details.");
                localStorage.removeItem("token");
                localStorage.removeItem("id");
                history.push("/login");
            }
        }

        fetchData();
        // eslint-disable-next-line
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
        <BaseContainer className="game container">
            <h2>Welcome!</h2>
            <p className="game paragraph">
                Get all users from secure endpoint:
            </p>
            {userList}
        </BaseContainer>
    );
}

export default Home;
