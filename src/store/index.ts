import { configureStore } from '@reduxjs/toolkit';
import gameEnhancementReducer from './slices/gameEnhancementSlice';

export const store = configureStore({
  reducer: {
    gameEnhancement: gameEnhancementReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['gameEnhancement/enhanceGameData/pending', 'gameEnhancement/enhanceGameData/fulfilled', 'gameEnhancement/enhanceGameData/rejected'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
