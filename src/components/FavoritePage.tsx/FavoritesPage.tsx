import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import { removeFromFavorites } from "../../store/favoritesSlice";
import { Recipe } from "../../types/recipeTypes";
import "./favoritePage.css"

const FavoritesPage: React.FC = () => {
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.favorites.favorites);

  const getCombinedIngredients = () => {
    const ingredientMap: { [key: string]: number } = {};
    const unitMap: { [key: string]: string } = {}; 

    favorites.forEach((recipe) => {
      for (let i = 1; i <= 20; i++) {
        const ingredient = recipe[`strIngredient${i}` as keyof Recipe] as string;
        let measure = recipe[`strMeasure${i}` as keyof Recipe] as string;

        if (ingredient && ingredient.trim() !== "") {
          const ingredientKey = ingredient.toLowerCase().trim(); 

       
          const match = measure.match(/^(\d*\.?\d+)\s*(.*)$/);
          let quantity = match ? parseFloat(match[1]) : 1; 
          let unit = match ? match[2].trim() : measure.trim(); 

         
          if (ingredientMap[ingredientKey]) {
            ingredientMap[ingredientKey] += quantity;
          } else {
            ingredientMap[ingredientKey] = quantity;
            unitMap[ingredientKey] = unit;
          }
        }
      }
    });

    return Object.entries(ingredientMap).map(([ingredient, count]) => {
      const unit = unitMap[ingredient] || "";
      return `${ingredient}: ${count} ${unit}`.trim();
    });
  };

  return (
    <div className="container">
      <h1>Вибрані рецепти</h1>

      {favorites.length === 0 ? (
        <p>Ви ще не додали рецепти в вибране</p>
      ) : (
        <>
          <div className="recipes-grid">
            {favorites.map((recipe) => (
              <div key={recipe.idMeal} className="recipe-card">
                <img src={recipe.strMealThumb} alt={recipe.strMeal} />
                <h2>{recipe.strMeal}</h2>
                <button onClick={() => dispatch(removeFromFavorites(recipe.idMeal))}>
                  Видалити
                </button>
              </div>
            ))}
          </div>

          <h2>Список інгредієнтів</h2>
          <ul>
            {getCombinedIngredients().map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default FavoritesPage;