import { BggCollectionItem } from './types';
import { fetchGameDetails } from '../api/fetchGameDetails';

export const enhanceCollectionData = async (
  boardgames: BggCollectionItem[]
): Promise<BggCollectionItem[]> => {
  if (boardgames.length === 0) return boardgames;

  // Extract unique game IDs
  const gameIds = [...new Set(boardgames.map(game => game.objectid))];
  
  // Fetch detailed game data in batches to avoid API limits
  const batchSize = 50; // BGG API allows up to 50 items per request
  const batches = [];
  
  for (let i = 0; i < gameIds.length; i += batchSize) {
    const batch = gameIds.slice(i, i + batchSize);
    batches.push(batch);
  }

  // Fetch all batches in parallel
  const detailedGamesPromises = batches.map(batch => fetchGameDetails(batch));
  const detailedGamesResults = await Promise.all(detailedGamesPromises);
  
  // Flatten the results
  const detailedGames = detailedGamesResults.flat();
  
  // Create a map for quick lookup
  const detailedGamesMap = new Map(
    detailedGames.map(game => [game.id, game])
  );

  // Enhance the original boardgames with detailed information
  return boardgames.map(game => {
    const detailedGame = detailedGamesMap.get(game.objectid);
    
    if (detailedGame) {
      return {
        ...game,
        categories: detailedGame.categories,
        mechanics: detailedGame.mechanics,
        families: detailedGame.families,
        publishers: detailedGame.publishers,
        artists: detailedGame.artists,
        designers: detailedGame.designers,
        compilations: detailedGame.compilations,
      };
    }
    
    return game;
  });
};
