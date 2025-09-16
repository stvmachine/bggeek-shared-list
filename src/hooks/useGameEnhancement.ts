import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  enhanceGameData,
  processEnhancementQueue,
  queueGamesForEnhancement,
} from "../store/slices/gameEnhancementSlice";
import { BggCollectionItem } from "../utils/types";

export const useGameEnhancement = () => {
  const dispatch = useAppDispatch();
  const {
    enhancedGames,
    enhancementStatus,
    enhancementQueue,
    isProcessing,
    error,
  } = useAppSelector((state) => state.gameEnhancement);

  // Function to enhance games in the background
  const enhanceGamesInBackground = useCallback(
    (boardgames: BggCollectionItem[]) => {
      if (boardgames.length === 0) return;

      // Extract unique game IDs
      const gameIds = [
        ...new Set(boardgames.map((game) => String(game.objectid))),
      ];

      // Queue games for enhancement
      dispatch(queueGamesForEnhancement(gameIds));
    },
    [dispatch]
  );

  // Function to get enhanced game data
  const getEnhancedGame = useCallback(
    (gameId: string) => {
      return enhancedGames[gameId] || null;
    },
    [enhancedGames]
  );

  // Function to check if a game is being enhanced
  const isGameEnhancing = useCallback(
    (gameId: string) => {
      return enhancementStatus[gameId] === "loading";
    },
    [enhancementStatus]
  );

  // Function to check if a game has been enhanced
  const isGameEnhanced = useCallback(
    (gameId: string) => {
      return enhancementStatus[gameId] === "succeeded";
    },
    [enhancementStatus]
  );

  // Function to enhance games with detailed information
  const enhanceGamesWithDetails = useCallback(
    (boardgames: BggCollectionItem[]): BggCollectionItem[] => {
      return boardgames.map((game) => {
        const enhancedGame = getEnhancedGame(String(game.objectid));

        if (enhancedGame) {
          return {
            ...game,
            categories: enhancedGame.categories,
            mechanics: enhancedGame.mechanics,
            families: enhancedGame.families,
            publishers: enhancedGame.publishers,
            artists: enhancedGame.artists,
            designers: enhancedGame.designers,
            compilations: enhancedGame.compilations,
          };
        }

        return game;
      });
    },
    [getEnhancedGame]
  );

  // Process enhancement queue when it has items
  useEffect(() => {
    if (enhancementQueue.length > 0 && !isProcessing) {
      dispatch(processEnhancementQueue());
    }
  }, [enhancementQueue.length, isProcessing, dispatch]);

  // Process enhancement queue by dispatching the async thunk
  useEffect(() => {
    if (enhancementQueue.length > 0 && !isProcessing) {
      const batchSize = 50; // BGG API limit
      const batch = enhancementQueue.slice(0, batchSize);

      if (batch.length > 0) {
        dispatch(enhanceGameData(batch));
      }
    }
  }, [enhancementQueue, isProcessing, dispatch]);

  return {
    enhanceGamesInBackground,
    getEnhancedGame,
    isGameEnhancing,
    isGameEnhanced,
    enhanceGamesWithDetails,
    isProcessing,
    error,
    enhancedGamesCount: Object.keys(enhancedGames).length,
    queueLength: enhancementQueue.length,
  };
};
