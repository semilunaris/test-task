import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Recipe } from "../types/recipeTypes";

interface FavoritesState {
  favorites: Recipe[];
}

const initialState: FavoritesState = {
  favorites: [],
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addToFavorites: (state, action: PayloadAction<Recipe>) => {
      const exists = state.favorites.find((recipe) => recipe.idMeal === action.payload.idMeal);
      if (!exists) {
        state.favorites.push(action.payload);
      }
    },
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter((recipe) => recipe.idMeal !== action.payload);
    },
  },
});

export const { addToFavorites, removeFromFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;