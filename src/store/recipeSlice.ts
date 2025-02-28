import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Recipe } from "../types/recipeTypes";

interface RecipeState {
  items: Recipe[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  selectedCategory: string | null; 
}


const initialState: RecipeState = {
  items: [],
  status: "idle",
  error: null,
  selectedCategory: null, 
};

// отримання всіх продуктів - таке моє креативне рішення)) 
export const fetchRecipesByCategory = createAsyncThunk<Recipe[], string, { rejectValue: string }>(
  "recipes/fetchRecipesByCategory",
  async (category, { rejectWithValue }) => {
    try {
      const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
      return response.data.meals || [];
    } catch (error) {
      return rejectWithValue("Помилка загрузки рецепта");
    }
  }
);

// Отримуємо всі продукти від A-Z
const fetchAllRecipes = async (): Promise<Recipe[]> => {
  const recipes: Recipe[] = [];
  
  // Перебираємо всі літери от A до Z
  for (let charCode = 65; charCode <= 90; charCode++) {
    const letter = String.fromCharCode(charCode);
    
    // Запрошуємо рецептики по букві
    try {
      const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
      if (response.data.meals) {
        recipes.push(...response.data.meals); // пушим в масив
      }
    } catch (error) {
      console.error(`Помилка при отриманні рецепта за буквою ${letter}`);
    }
  }

  return recipes;
};


export const fetchRecipes = createAsyncThunk<Recipe[], void, { rejectValue: string }>(
  "recipes/fetchRecipes",
  async (_, { rejectWithValue }) => {
    try {
   
      const storedRecipes = localStorage.getItem("allRecipes");

      if (storedRecipes) {
    
        return JSON.parse(storedRecipes);
      } else {
        // якщо в локал сторадж немає даних записуємо їх тули
        const recipes = await fetchAllRecipes();
        localStorage.setItem("allRecipes", JSON.stringify(recipes)); // зберігаємо
        return recipes;
      }
    } catch (error) {
      return rejectWithValue("Помилка при загрузці рецепту");
    }
  }
);

const recipeSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRecipes.fulfilled, (state, action: PayloadAction<Recipe[]>) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Невідома помилка";
      })
      .addCase(fetchRecipesByCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRecipesByCategory.fulfilled, (state, action: PayloadAction<Recipe[]>) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchRecipesByCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Невідома помилка";
      });
  },
});

export const { setCategory } = recipeSlice.actions;

export default recipeSlice.reducer;