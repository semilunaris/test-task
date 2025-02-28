import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Recipe } from "../types/recipeTypes";

interface RecipeState {
  items: Recipe[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  selectedCategory: string | null; // Для фильтрации по категории
}

// Начальное состояние
const initialState: RecipeState = {
  items: [],
  status: "idle",
  error: null,
  selectedCategory: null, // Начально категорию не выбрано
};

// Асинхронный экшен для загрузки рецептов по категории
export const fetchRecipesByCategory = createAsyncThunk<Recipe[], string, { rejectValue: string }>(
  "recipes/fetchRecipesByCategory",
  async (category, { rejectWithValue }) => {
    try {
      const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
      return response.data.meals || [];
    } catch (error) {
      return rejectWithValue("Ошибка загрузки рецептов");
    }
  }
);

// Асинхронный экшен для загрузки всех рецептов
export const fetchRecipes = createAsyncThunk<Recipe[], void, { rejectValue: string }>(
  "recipes/fetchRecipes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("https://www.themealdb.com/api/json/v1/1/search.php?f=b");
      return response.data.meals || [];
    } catch (error) {
      return rejectWithValue("Ошибка загрузки рецептов");
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
        state.error = action.payload || "Неизвестная ошибка";
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
        state.error = action.payload || "Неизвестная ошибка";
      });
  },
});

export const { setCategory } = recipeSlice.actions;

export default recipeSlice.reducer;