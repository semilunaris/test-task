import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import RecipeList from "./components/RecipeList/RecipeList";
import FavoritesPage from "./components/FavoritePage.tsx/FavoritesPage";
import RecipeDetails from "./components/RecipeDetails/RecipeDetails";
import "./App.css"

function App() {
  return (
    <Router>
      <nav>
        <Link to="/test-task">Всі рецепти</Link>
        <Link to="/favorites">Вибрані</Link>
      </nav>
      <Routes>
        <Route path="/test-task" element={<RecipeList />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/recipe/:id" element={<RecipeDetails />} />
      </Routes>
    </Router>
  );
}

export default App