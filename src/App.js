import AppRouter from "components/routing/routers/AppRouter";
import bg from "images/BG.png";

/**
 * Happy coding!
 * React Template by Lucas Pelloni
 * Overhauled by Kyrill Hux
 */
const App = () => {
  return (
      <div className="background" style={{background: `url(${bg})`}}>
        <AppRouter/>
      </div>
  );
};

export default App;
