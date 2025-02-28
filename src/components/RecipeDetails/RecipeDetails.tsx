import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Recipe } from "../../types/recipeTypes";
import "./recipeDetails.css"

const RecipeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const response = await axios.get(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        );
        setRecipe(response.data.meals ? response.data.meals[0] : null);
      } catch (err) {
        setError("Помилка загрузки");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [id]);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;
  if (!recipe) return <p>Рецепт не знайдено</p>;

  return (
    <div className="recipe-details">
      <h1>{recipe.strMeal}</h1>
      <img src={recipe.strMealThumb} alt={recipe.strMeal} />
      <p><strong>Категорія:</strong> {recipe.strCategory}</p>
      <p><strong>Кухня:</strong> {recipe.strArea}</p>
      <p><strong>Інструкції:</strong> {recipe.strInstructions}</p>

      <h2>Інгредієнти:</h2>
      <ul>
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => {
          const ingredient = recipe[`strIngredient${num}` as keyof Recipe];
          const measure = recipe[`strMeasure${num}` as keyof Recipe];
          return ingredient ? <li key={num}>{ingredient} - {measure}</li> : null;
        })}
      </ul>

      <Link to="/test-task">
        <button>Назад</button>
      </Link>
    </div>
  );
};

export default RecipeDetails;