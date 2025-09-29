import { useQuery } from "@apollo/client/react";
import { GET_USER_COLLECTION } from "../lib/graphql/queries";
import { GetUserCollectionQuery } from "../lib/graphql/generated/types";
import { useMemo } from "react";

const mergeCollectionsGraphQL = (
  rawData: any[],
  usernames: string[] = []
): {
  boardgames: any[];
  collections: { totalitems: number; pubdate: string }[];
} => {
  const collections = rawData.map((collection: any) => {
    const { totalItems, pubDate } = collection || {};
    return {
      totalitems: totalItems,
      pubdate: pubDate,
    };
  });

  // Create a map to track which games belong to which users
  const gameOwnersMap = new Map<string, string[]>();

  rawData.forEach((collection: any, collectionIndex) => {
    const username = usernames[collectionIndex];
    if (collection && collection.items && Array.isArray(collection.items)) {
      collection.items.forEach((game: any) => {
        const gameId = String(game.objectId);
        if (!gameOwnersMap.has(gameId)) {
          gameOwnersMap.set(gameId, []);
        }
        if (username) {
          gameOwnersMap.get(gameId)?.push(username);
        }
      });
    }
  });

  const boardgames = rawData
    .filter(
      (collection: any) =>
        collection && collection.items && Array.isArray(collection.items)
    )
    .reduce(
      (accum: any[], collection: any) => [
        ...accum,
        ...(collection.items || []),
      ],
      []
    )
    .reduce((accum, bgg) => {
      const gameId = String(bgg.objectId);
      const owners = gameOwnersMap.get(gameId) || [];

      return {
        ...accum,
        [gameId]: {
          ...bgg,
          objectid: bgg.objectId, // Ensure objectid is set correctly
          name: {
            text: bgg.name,
          },
          thumbnail: bgg.thumbnail,
          image: bgg.image,
          yearpublished: bgg.yearPublished,
          numplays: bgg.numPlays,
          status: bgg.status,
          owners: owners.map(username => ({
            username,
            status: { own: 1 }, // Default status
            collid: `${username}_${gameId}`, // Generate a unique collid
          })),
        },
      };
    }, {});

  return {
    collections: collections,
    boardgames: Object.values(boardgames),
  };
};

export const useCollections = (usernames: string[]) => {
  // Use Apollo's useQuery for each username
  const collectionQueries = usernames.map(username =>
    useQuery<GetUserCollectionQuery>(GET_USER_COLLECTION, {
      variables: { username },
      skip: !username, // Skip if no username
      errorPolicy: "all",
      notifyOnNetworkStatusChange: true,
    })
  );

  // Check if any query is loading
  const isLoading = useMemo(
    () => collectionQueries.some(query => query.loading),
    [collectionQueries]
  );

  // Check if any query has errors
  const hasErrors = useMemo(
    () => collectionQueries.some(query => query.error),
    [collectionQueries]
  );

  // Get all errors
  const errors = useMemo(
    () =>
      collectionQueries
        .map((query, index) => ({
          username: usernames[index],
          error: query.error,
        }))
        .filter(({ error }) => error),
    [collectionQueries, usernames]
  );

  // Process and merge the data
  const data = useMemo(() => {
    if (isLoading || hasErrors) return undefined;

    const collectionsData = collectionQueries
      .map(query => query.data?.userCollection)
      .filter(Boolean);

    if (collectionsData.length === 0) return undefined;

    return mergeCollectionsGraphQL(collectionsData, usernames);
  }, [collectionQueries, usernames, isLoading, hasErrors]);

  return {
    data,
    isLoading,
    hasErrors,
    errors,
    // Individual query states for debugging
    queries: collectionQueries,
  };
};
