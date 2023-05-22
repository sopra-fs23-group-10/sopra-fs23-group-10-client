import AppRouter from "components/routing/routers/AppRouter";
import bg from "images/BG.png";
import { register } from "helpers/WebSocketFactory";
import {useEffect} from "react";
import Music from "components/views/Music";

const App = () => {
    localStorage.setItem("total_questions", 1);

    useEffect(() => {
      register();
    }, []);

    return (
      <div className="background" style={{background: `url(${bg})`}}>
        <Music />
        <AppRouter/>
      </div>
  );
};

export default App;
