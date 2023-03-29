import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import {HomeGuard} from "components/routing/routeProtectors/HomeGuard";
import HomeRouter from "components/routing/routers/HomeRouter";
import {LoginGuard} from "components/routing/routeProtectors/LoginGuard";
import Registration from "../../views/Registration";
import Login from "../../views/Login";
import UserProfile from "../../views/UserProfile";
import ProfileEditor from "../../views/ProfileEditor";

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
        <Route exact path="/users/edit/:user_id">
          <HomeGuard>
            <ProfileEditor/>
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