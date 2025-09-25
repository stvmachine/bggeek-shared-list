import { useLazyQuery, useQuery } from "@apollo/client/react";
import {
  GET_GAME_DETAILS,
  GET_USER,
  GET_USER_COLLECTION,
  SEARCH_GAMES,
} from "../lib/graphql/queries";

// Hook to get a single user's collection
export const useUserCollection = (username: string, options?: any) => {
  return useQuery(GET_USER_COLLECTION, {
    variables: { username },
    skip: !username,
    ...options,
  });
};

// Hook to get user information
export const useUser = (username: string, options?: any) => {
  return useQuery(GET_USER, {
    variables: { username },
    skip: !username,
    ...options,
  });
};

// Hook to get multiple users' collections (makes multiple individual calls)
export const useMultipleCollections = (
  _usernames: string[],
  _options?: any
) => {
  // Since the schema doesn't support multiple collections in one query,
  // we'll need to make multiple individual calls
  // This is a placeholder - implementation would need to be done differently
  return { data: null, loading: false, error: null };
};

// Hook to search for games (lazy query for on-demand search)
export const useSearchGames = () => {
  return useLazyQuery(SEARCH_GAMES);
};

// Hook to get game details
export const useGameDetails = (objectId: string, options?: any) => {
  return useQuery(GET_GAME_DETAILS, {
    variables: { objectId },
    skip: !objectId,
    ...options,
  });
};

// Hook to get multiple users' collections with lazy loading
export const useLazyMultipleCollections = () => {
  // Placeholder since multiple collections query doesn't exist
  return { data: null, loading: false, error: null };
};
