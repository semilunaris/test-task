import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecipes, fetchRecipesByCategory, setCategory } from "../store/recipeSlice";
import { RootState, AppDispatch } from "../store/store";
import { Recipe } from "../types/recipeTypes";
import { Link } from "react-router-dom";

const RecipeList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { items: recipes, status, error, selectedCategory } = useSelector(
    (state: RootState) => state.recipes
  );

  const [category, setCategoryState] = useState<string>("");

  useEffect(() => {
    if (category) {
      // Фетчим рецепты по категории
      dispatch(fetchRecipesByCategory(category));
    } else {
      // Если категория не выбрана, то фетчим все рецепты
      dispatch(fetchRecipes());
    }
  }, [category, dispatch]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryState(e.target.value);
    dispatch(setCategory(e.target.value)); // Обновляем состояние выбранной категории
  };

  if (status === "loading") return <p>Загрузка рецептов...</p>;
  if (status === "failed") return <p>Ошибка: {error}</p>;

  return (
    <div className="container">
      <h1>Список рецептів</h1>

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
        {recipes.map((recipe: Recipe) => (
          <div key={recipe.idMeal} className="recipe-card">
            <img src={recipe.strMealThumb} alt={recipe.strMeal} />
            <h2>{recipe.strMeal}</h2>
            <Link to={`/recipe/${recipe.idMeal}`}>Посмотреть детали</Link>
            <p>{recipe.strCategory} - {recipe.strArea}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeList;