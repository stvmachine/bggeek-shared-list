import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { BggCollectionItem } from '../../utils/types';

// Types
interface GameEnhancementState {
  enhancedGames: Record<string, BggCollectionItem>; // gameId -> enhanced game data
  enhancementStatus: Record<string, 'idle' | 'loading' | 'succeeded' | 'failed'>; // gameId -> status
  lastEnhanced: Record<string, number>; // gameId -> timestamp
  enhancementQueue: string[]; // queue of game IDs to enhance
  isProcessing: boolean;
  error: string | null;
}

const initialState: GameEnhancementState = {
  enhancedGames: {},
  enhancementStatus: {},
  lastEnhanced: {},
  enhancementQueue: [],
  isProcessing: false,
  error: null,
};

// Async thunk for enhancing game data
export const enhanceGameData = createAsyncThunk(
  'gameEnhancement/enhanceGameData',
  async (gameIds: string[], { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/game-details?gameIds=${gameIds.join(',')}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const detailedGames = await response.json();
      return detailedGames;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to enhance game data');
    }
  }
);

// Helper function to check if enhancement is needed
const shouldEnhance = (_gameId: string, lastEnhanced: number, expirationTime: number = 24 * 60 * 60 * 1000) => {
  const now = Date.now();
  return !lastEnhanced || (now - lastEnhanced) > expirationTime;
};

const gameEnhancementSlice = createSlice({
  name: 'gameEnhancement',
  initialState,
  reducers: {
    // Add games to enhancement queue
    queueGamesForEnhancement: (state, action: PayloadAction<string[]>) => {
      const gameIds = action.payload;
      const expirationTime = 24 * 60 * 60 * 1000; // 24 hours
      
      const gamesToEnhance = gameIds.filter(gameId => 
        shouldEnhance(gameId, state.lastEnhanced[gameId] || 0, expirationTime) &&
        state.enhancementStatus[gameId] !== 'loading' &&
        state.enhancementStatus[gameId] !== 'succeeded'
      );
      
      // Add to queue if not already there
      gamesToEnhance.forEach(gameId => {
        if (!state.enhancementQueue.includes(gameId)) {
          state.enhancementQueue.push(gameId);
        }
      });
    },
    
    // Process enhancement queue
    processEnhancementQueue: (state) => {
      if (state.isProcessing || state.enhancementQueue.length === 0) return;
      
      state.isProcessing = true;
      // Take up to 50 games at a time (BGG API limit)
      const batchSize = 50;
      const batch = state.enhancementQueue.splice(0, batchSize);
      
      // Mark as loading
      batch.forEach(gameId => {
        state.enhancementStatus[gameId] = 'loading';
      });
    },
    
    // Clear enhancement queue
    clearEnhancementQueue: (state) => {
      state.enhancementQueue = [];
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Reset all state
    resetEnhancementState: (_state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(enhanceGameData.pending, (state) => {
        state.isProcessing = true;
        state.error = null;
      })
      .addCase(enhanceGameData.fulfilled, (state, action) => {
        state.isProcessing = false;
        const detailedGames = action.payload;
        const now = Date.now();
        
        // Update enhanced games and status
        detailedGames.forEach((game: any) => {
          const gameId = game.id;
          state.enhancedGames[gameId] = game;
          state.enhancementStatus[gameId] = 'succeeded';
          state.lastEnhanced[gameId] = now;
        });
      })
      .addCase(enhanceGameData.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = action.payload as string;
        
        // Mark failed games in the current batch
        // Note: We don't know which specific games failed, so we'll mark all as failed
        // In a more sophisticated implementation, you'd track which games were in the current batch
      });
  },
});

export const {
  queueGamesForEnhancement,
  processEnhancementQueue,
  clearEnhancementQueue,
  clearError,
  resetEnhancementState,
} = gameEnhancementSlice.actions;

export default gameEnhancementSlice.reducer;
