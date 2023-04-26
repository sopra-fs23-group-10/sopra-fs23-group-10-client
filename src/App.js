import AppRouter from "components/routing/routers/AppRouter";
import bg from "images/BG.png";
import { register } from "helpers/WebSocketFactory";
import {useEffect} from "react";

/**
 * Happy coding!
 * React Template by Lucas Pelloni
 * Overhauled by Kyrill Hux
 */
const App = () => {
    useEffect(() => {
      register();
    }, []);

    return (
      <div className="background" style={{background: `url(${bg})`}}>
        <AppRouter/>
      </div>
  );
};

export default App;
