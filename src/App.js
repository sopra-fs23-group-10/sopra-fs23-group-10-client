import AppRouter from "components/routing/routers/AppRouter";
import bg from "images/BG.png";
import { register } from "helpers/WebSocketFactory";

/**
 * Happy coding!
 * React Template by Lucas Pelloni
 * Overhauled by Kyrill Hux
 */
const App = () => {
  return (
      <div className="background" style={{background: `url(${bg})`}}>
        {register()}
        <AppRouter/>
      </div>
  );
};

export default App;
