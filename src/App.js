import Header from "components/views/Header";
import AppRouter from "components/routing/routers/AppRouter";
import bg from "BG.png";

/**
 * Happy coding!
 * React Template by Lucas Pelloni
 * Overhauled by Kyrill Hux
 */
const App = () => {
  return (
    <div>
      <img className="background" src={bg}></img>
      <Header height="100"/>
      <AppRouter/>
    </div>
  );
};

export default App;
