import React from "react";

const RecipeCard: React.FC<{ recipe: any }> = ({ recipe }) => {
  return (
    <div className="recipe-card">
      <img src={recipe.strMealThumb} alt={recipe.strMeal} />
      <h3>{recipe.strMeal}</h3>
      <a href={`/recipe/${recipe.idMeal}`}>Подробнее</a>
    </div>
  );
};

export default RecipeCard;
