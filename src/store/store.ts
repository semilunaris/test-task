import { configureStore } from "@reduxjs/toolkit";
import recipeReducer from "./recipeSlice";
import favoritesReducer from "./favoritesSlice";

export const store = configureStore({
  reducer: {
    recipes: recipeReducer,
    favorites: favoritesReducer,
  }
});

// Типы для использования в `useSelector` и `useDispatch`
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;