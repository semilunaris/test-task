import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecipes, fetchRecipesByCategory, setCategory } from "../../store/recipeSlice";
import { addToFavorites, removeFromFavorites } from "../../store/favoritesSlice";
import { RootState, AppDispatch } from "../../store/store";
import { Recipe } from "../../types/recipeTypes";
import { Link } from "react-router-dom";
import "./recipeList.css";

const RecipeList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { items: recipes, status, error } = useSelector(
    (state: RootState) => state.recipes
  );
  const favorites = useSelector((state: RootState) => state.favorites.favorites);

  const [category, setCategoryState] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [recipesPerPage] = useState<number>(10);

  useEffect(() => {
    if (category) {
      dispatch(fetchRecipesByCategory(category));
    } else {
      dispatch(fetchRecipes());
    }
  }, [category, dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.strMeal.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = filteredRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryState(e.target.value);
    dispatch(setCategory(e.target.value));
  };

  const toggleFavorite = (recipe: Recipe) => {
    const isFavorite = favorites.some((fav) => fav.idMeal === recipe.idMeal);
    if (isFavorite) {
      dispatch(removeFromFavorites(recipe.idMeal));
    } else {
      dispatch(addToFavorites(recipe));
    }
  };

  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const getPageRange = () => {
    let start = Math.max(1, currentPage - 3);
    let end = Math.min(totalPages, start + 6);

    if (end - start < 7 && start > 1) {
      start = end - 6;
    }

    return { start, end };
  };

  const { start, end } = getPageRange();

  const paginatePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const paginateNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (status === "loading") return <p>Загрузка рецептів...</p>;
  if (status === "failed") return <p>Помилка: {error}</p>;

  return (
    <div className="container">
      <h1>Список рецептів</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Поиск рецепта..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="category-filter">
        <label htmlFor="category">Выберіть категорію: </label>
        <select id="category" value={category} onChange={handleCategoryChange}>
          <option value="">Все категорії</option>
          <option value="Chicken">Курииця</option>
          <option value="Beef">Говядина</option>
          <option value="Vegetarian">Вегетаріанське</option>
          <option value="Seafood">Морепродукти</option>
          <option value="Dessert">Десерти</option>
        </select>
      </div>

      <div className="recipes-grid">
        {currentRecipes.map((recipe: Recipe) => {
          const isFavorite = favorites.some((fav) => fav.idMeal === recipe.idMeal);

          return (
            <div key={recipe.idMeal} className="recipe-card">
              <img src={recipe.strMealThumb} alt={recipe.strMeal} />
              <h2>{recipe.strMeal}</h2>
              <p>{recipe.strCategory} - {recipe.strArea}</p>
              <Link to={`/recipe/${recipe.idMeal}`}>Подивитись деталі</Link>
              <button onClick={() => toggleFavorite(recipe)}>
                {isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
              </button>
            </div>
          );
        })}
      </div>

      <div className="pagination">
        <button onClick={paginatePrev} disabled={currentPage === 1}>
          ←
        </button>

        {start > 1 && (
          <>
            <button onClick={() => handlePageChange(1)}>1</button>
            <span>...</span>
          </>
        )}

        {pageNumbers.slice(start - 1, end).map((number) => (
          <button
            key={number}
            onClick={() => handlePageChange(number)}
            className={number === currentPage ? "active" : ""}
          >
            {number}
          </button>
        ))}

        {end < totalPages && (
          <>
            <span>...</span>
            <button onClick={() => handlePageChange(totalPages)}>{totalPages}</button>
          </>
        )}

        <button onClick={paginateNext} disabled={currentPage === totalPages}>
          →
        </button>
      </div>
    </div>
  );
};

export default RecipeList;