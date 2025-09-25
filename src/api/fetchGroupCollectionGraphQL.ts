import { apolloClient } from "../lib/graphql/client";
import { GET_USER_COLLECTION } from "../lib/graphql/queries";
import { GetUserCollectionQuery } from "../lib/graphql/generated/types";

export const fetchCollectionsGraphQL = async (
  usernames: string[]
): Promise<any[]> => {
  try {
    // Fetch collections individually since the schema doesn't support multiple collections in one query
    const collections = await Promise.all(
      usernames.map(async username => {
        const { data, error } =
          await apolloClient.query<GetUserCollectionQuery>({
            query: GET_USER_COLLECTION,
            variables: { username },
            errorPolicy: "all",
          });

        if (error) {
          console.error(`GraphQL errors for ${username}:`, error);
        }

        return data?.userCollection;
      })
    );

    const validCollections = collections.filter(Boolean);

    if (validCollections.length === 0) {
      throw new Error("No collections data received");
    }

    return validCollections;
  } catch (error) {
    console.error("Error fetching collections via GraphQL:", error);
    throw error;
  }
};

export const mergeCollectionsGraphQL = (
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
