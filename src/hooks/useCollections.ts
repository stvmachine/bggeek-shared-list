import { useLazyQuery } from "@apollo/client/react";
import { GET_USER_COLLECTION } from "../lib/graphql/queries";
import { GetUserCollectionQuery } from "../lib/graphql/generated/types";
import { useMemo, useEffect, useState } from "react";

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
          objectId: bgg.objectId, // Ensure objectId is set correctly
          name: {
            text: bgg.name,
          },
          thumbnail: bgg.thumbnail,
          image: bgg.image,
          yearpublished: bgg.yearPublished,
          numplays: bgg.numPlays,
          owners: owners.map(username => ({
            username,
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
  const [results, setResults] = useState<
    Record<
      string,
      {
        data: any;
        error: any;
        loading: boolean;
      }
    >
  >({});

  const [getCollection, { loading, error }] =
    useLazyQuery<GetUserCollectionQuery>(GET_USER_COLLECTION, {
      errorPolicy: "all",
    });

  useEffect(() => {
    if (usernames.length === 0) {
      setResults({});
      return;
    }

    // Initialize results with loading state
    const initialResults: Record<
      string,
      { data: any; error: any; loading: boolean }
    > = {};
    usernames.forEach(username => {
      initialResults[username] = {
        data: null,
        error: null,
        loading: true,
      };
    });
    setResults(initialResults);

    // Fetch each collection sequentially
    const fetchCollections = async () => {
      const newResults: Record<
        string,
        { data: any; error: any; loading: boolean }
      > = {};

      for (const username of usernames) {
        try {
          const result = await getCollection({
            variables: { username },
          });
          newResults[username] = {
            data: result.data?.userCollection || null,
            error: result.error || null,
            loading: false,
          };
        } catch (err) {
          newResults[username] = {
            data: null,
            error: err,
            loading: false,
          };
        }
      }
      setResults(newResults);
    };

    fetchCollections();
  }, [usernames, getCollection]);

  // Use Apollo's built-in states
  const isLoading =
    loading || Object.values(results).some(result => result.loading);
  const hasErrors =
    !!error || Object.values(results).some(result => result.error);

  // Get all errors
  const errors = Object.entries(results)
    .filter(([_, result]) => result.error)
    .map(([username, result]) => ({ username, error: result.error }));

  // Process and merge the data
  const data = useMemo(() => {
    if (isLoading || hasErrors) return undefined;

    const collectionsData = Object.values(results)
      .map(result => result.data)
      .filter(Boolean);

    if (collectionsData.length === 0) return undefined;

    return mergeCollectionsGraphQL(collectionsData, usernames);
  }, [results, usernames, isLoading, hasErrors]);

  return {
    data,
    isLoading,
    hasErrors,
    errors,
  };
};
