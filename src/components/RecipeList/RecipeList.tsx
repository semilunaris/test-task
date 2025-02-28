import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecipes, fetchRecipesByCategory, setCategory } from "../../store/recipeSlice";
import { addToFavorites, removeFromFavorites } from "../../store/favoritesSlice";
import { RootState, AppDispatch } from "../../store/store";
import { Recipe } from "../../types/recipeTypes";
import { Link } from "react-router-dom";
import "./recipeList.css"

const RecipeList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { items: recipes, status, error, selectedCategory } = useSelector(
    (state: RootState) => state.recipes
  );
  const favorites = useSelector((state: RootState) => state.favorites.favorites);

  const [category, setCategoryState] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>(""); // Стейт для поиска
  const [debouncedQuery, setDebouncedQuery] = useState<string>(""); // Задержанный запрос

  useEffect(() => {
    if (category) {
      dispatch(fetchRecipesByCategory(category));
    } else {
      dispatch(fetchRecipes());
    }
  }, [category, dispatch]);

  // useEffect для debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500); // Ожидание 500 мс перед обновлением

    return () => clearTimeout(timer); // Очистка таймера при изменении ввода
  }, [searchQuery]);

  // Фильтрация рецептов по названию
  const filteredRecipes = recipes.filter((recipe) =>
    recipe.strMeal.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

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

  if (status === "loading") return <p>Загрузка рецептов...</p>;
  if (status === "failed") return <p>Ошибка: {error}</p>;

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
        <label htmlFor="category">Выберите категорию: </label>
        <select id="category" value={category} onChange={handleCategoryChange}>
          <option value="">Все категории</option>
          <option value="Chicken">Курица</option>
          <option value="Beef">Говядина</option>
          <option value="Vegetarian">Вегетарианские</option>
          <option value="Seafood">Морепродукты</option>
          <option value="Dessert">Десерты</option>
        </select>
      </div>

      <div className="recipes-grid">
        {filteredRecipes.map((recipe: Recipe) => {
          const isFavorite = favorites.some((fav) => fav.idMeal === recipe.idMeal);

          return (
            <div key={recipe.idMeal} className="recipe-card">
              <img src={recipe.strMealThumb} alt={recipe.strMeal} />
              <h2>{recipe.strMeal}</h2>
              <p>{recipe.strCategory} - {recipe.strArea}</p>
              <Link to={`/recipe/${recipe.idMeal}`}>Посмотреть детали</Link>
              
              {/* Кнопка добавления в избранное */}
              <button onClick={() => toggleFavorite(recipe)}>
                {isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecipeList;