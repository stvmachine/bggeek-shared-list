import { useMemo } from "react";
import { useUserValidation } from "./useUserValidation";
import { useUserCollection } from "./useUserCollection";

interface UseMultiUserCollectionsProps {
  usernames: string[];
}

export function useMultiUserCollections({ usernames }: UseMultiUserCollectionsProps) {  // For now, let's handle up to 2 usernames individually
  const user1Validation = useUserValidation({ 
    username: usernames[0] || "", 
    skip: !usernames[0] 
  });
  const user1Collection = useUserCollection({ 
    username: usernames[0] || "", 
    skip: !usernames[0] 
  });

  const user2Validation = useUserValidation({ 
    username: usernames[1] || "", 
    skip: !usernames[1] 
  });
  const user2Collection = useUserCollection({ 
    username: usernames[1] || "", 
    skip: !usernames[1] 
  });

  // Aggregate loading states
  const isLoading = user1Validation.loading || user1Collection.loading || 
                   user2Validation.loading || user2Collection.loading;
  
  // Aggregate errors
  const errors = [
    user1Validation.error,
    user1Collection.error,
    user2Validation.error,
    user2Collection.error,
  ].filter(Boolean);

  // Get valid users
  const validUsers = useMemo(() => {
    const valid = [];
    if (usernames[0] && user1Validation.isValid && user1Collection.hasData) {
      valid.push(usernames[0]);
    }
    if (usernames[1] && user2Validation.isValid && user2Collection.hasData) {
      valid.push(usernames[1]);
    }
    return valid;
  }, [usernames, user1Validation.isValid, user1Collection.hasData, user2Validation.isValid, user2Collection.hasData]);

  // Get invalid users
  const invalidUsers = useMemo(() => {
    const invalid = [];
    if (usernames[0] && (user1Validation.isInvalid || user1Collection.error)) {
      invalid.push(usernames[0]);
    }
    if (usernames[1] && (user2Validation.isInvalid || user2Collection.error)) {
      invalid.push(usernames[1]);
    }
    return invalid;
  }, [usernames, user1Validation.isInvalid, user1Collection.error, user2Validation.isInvalid, user2Collection.error]);

  // Merge all boardgames from valid collections
  const allBoardgames = useMemo(() => {
    const allGames = [];
    
    // Add games from user1 with owner info
    if (user1Collection.hasData && usernames[0]) {
      const user1Games = user1Collection.boardgames.map(game => ({
        ...game,
        owners: [{ username: usernames[0] }]
      }));
      allGames.push(...user1Games);
    }
    
    // Add games from user2 with owner info
    if (user2Collection.hasData && usernames[1]) {
      const user2Games = user2Collection.boardgames.map(game => ({
        ...game,
        owners: [{ username: usernames[1] }]
      }));
      allGames.push(...user2Games);
    }

    // Deduplicate by objectId and merge owners
    const gameMap = new Map();
    allGames.forEach(game => {
      if (gameMap.has(game.objectId)) {
        // Merge owners for duplicate games
        const existingGame = gameMap.get(game.objectId);
        existingGame.owners = [...existingGame.owners, ...game.owners];
      } else {
        gameMap.set(game.objectId, game);
      }
    });

    return Array.from(gameMap.values());
  }, [user1Collection.boardgames, user2Collection.boardgames, usernames]);

  // Get all collections
  const allCollections = useMemo(() => {
    const collections = [];
    if (user1Collection.hasData) {
      collections.push(user1Collection.collection);
    }
    if (user2Collection.hasData) {
      collections.push(user2Collection.collection);
    }
    return collections;
  }, [user1Collection.collection, user2Collection.collection]);

  return {
    // Individual states
    userValidations: [user1Validation, user2Validation],
    userCollections: [user1Collection, user2Collection],
    
    // Aggregated states
    isLoading,
    errors,
    
    // Processed data
    validUsers,
    invalidUsers,
    allBoardgames,
    allCollections,
    
    // Counts
    totalUsers: usernames.length,
    validUserCount: validUsers.length,
    invalidUserCount: invalidUsers.length,
  };
}