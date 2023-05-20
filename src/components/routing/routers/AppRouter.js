import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import {HomeGuard} from "components/routing/routeProtectors/HomeGuard";
import {GameGuard} from "components/routing/routeProtectors/GameGuard";
import HomeRouter from "components/routing/routers/HomeRouter";
import {LoginGuard} from "components/routing/routeProtectors/LoginGuard";
import Registration from "../../views/Registration";
import Login from "../../views/Login";
import UserProfile from "../../views/UserProfile";
import ResetPassword from "../../views/ResetPassword";
import ChallengePlayer from "../../views/ChallengePlayer";
import Ranking from "../../views/Ranking";
import Rules from "../../views/Rules";
import GameScreen from "../../views/GameScreen";
import Score from "../../views/Score";
import TopicSelectionSingle from "../../views/TopicSelectionSingle";
import EndGame from "../../views/EndGame";
import ImageQuizStart from "components/views/ImageQuizStart";
import ProfilePicture from "../../views/ProfilePicture";

/**
 * Main router of your application.
 * In the following class, different routes are rendered. In our case, there is a Login Route with matches the path "/login"
 * and another Router that matches the route "/game".
 * The main difference between these two routes is the following:
 * /login renders another component without any sub-route
 * /game renders a Router that contains other sub-routes that render in turn other react components
 * Documentation about routing in React: https://reacttraining.com/react-router/web/guides/quick-start
 */
const AppRouter = () => {
  return (
      <BrowserRouter>
        <Switch>
          <Route path="/home">
            <HomeGuard>
              <HomeRouter base="/home"/>
            </HomeGuard>
          </Route>
          <Route exact path="/users/:user_id">
            <HomeGuard>
              <UserProfile/>
            </HomeGuard>
          </Route>
          <Route exact path="/users/:user_id/profilepicture">
            <HomeGuard>
              <ProfilePicture/>
            </HomeGuard>
          </Route>
          <Route exact path="/challenge/:gameMode">
            <HomeGuard>
              <ChallengePlayer/>
            </HomeGuard>
          </Route>
          <Route exact path="/registration">
            <LoginGuard>
              <Registration/>
            </LoginGuard>
          </Route>
          <Route exact path="/login">
            <LoginGuard>
              <Login/>
            </LoginGuard>
          </Route>
          <Route exact path="/resetpassword">
            <LoginGuard>
              <ResetPassword/>
            </LoginGuard>
          </Route>
          <Route path="/ranking">
            <HomeGuard>
              <Ranking/>
            </HomeGuard>
          </Route>
          <Route path="/rules">
            <HomeGuard>
              <Rules/>
            </HomeGuard>
          </Route>
          <Route path="/game/:playerMode/:gameMode/:selecting">
            <GameGuard>
              <GameScreen/>
            </GameGuard>
          </Route>
          <Route path="/topic-selection/:playerMode/:gameMode/:selecting">
            <GameGuard>
              <Score/>
            </GameGuard>
          </Route>
          <Route path="/single-topic-selection/:gameMode">
            <GameGuard>
              <TopicSelectionSingle/>
            </GameGuard>
          </Route>
          <Route path="/single-image-start/:gameMode">
            <GameGuard>
              <ImageQuizStart/>
            </GameGuard>
          </Route>
          <Route path="/endgame/:playerMode/:gameMode/:selecting">
            <GameGuard>
              <EndGame/>
            </GameGuard>
          </Route>
          <Route exact path="/">
            <Redirect to="/home"/>
          </Route>
        </Switch>
      </BrowserRouter>
  );
};

/*
* Don't forget to export your component!
 */
export default AppRouter;
