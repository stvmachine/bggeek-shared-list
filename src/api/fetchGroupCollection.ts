import {
  getBggCollection,
  BggCollectionParams,
  BggCollectionResponse,
} from "bgg-xml-api-client";

export const fetchCollections = async (
  usernames: string[],
  options?: Partial<BggCollectionParams>
): Promise<BggCollectionResponse[]> =>
  Promise.all(usernames.map((username) => fetchCollection(username, options)));

export const fetchCollection = async (
  username: string,
  options?: Partial<BggCollectionParams>
): Promise<BggCollectionResponse> => {
  const params: BggCollectionParams = {
    username,
    own: 1,
    subtype: "boardgame",
    stats: 1,
    ...options,
  };

  const collectionResponse: BggCollectionResponse = await getBggCollection(
    params,
    {
      maxRetries: 3,
      retryInterval: 2000,
    }
  );

  console.log('Collection response for', username, ':', {
    totalitems: collectionResponse.totalitems,
    hasItem: !!collectionResponse.item,
    itemType: typeof collectionResponse.item,
    itemIsArray: Array.isArray(collectionResponse.item),
    itemLength: collectionResponse.item?.length
  });

  return collectionResponse;
};

export const mergeCollections = (
  rawData: BggCollectionResponse[],
  usernames: string[] = []
): { boardgames: any[]; collections: { totalitems: number; pubdate: string }[] } => {
  const collections = rawData.map((item: BggCollectionResponse) => {
    const { totalitems, pubdate } = item || {};
    return {
      totalitems,
      pubdate,
    };
  });

  // Create a map to track which games belong to which users
  const gameOwnersMap = new Map<string, string[]>();
  
  rawData.forEach((collection: BggCollectionResponse, collectionIndex) => {
    const username = usernames[collectionIndex];
    if (collection && collection.item && Array.isArray(collection.item)) {
      collection.item.forEach((game: any) => {
        const gameId = String(game.objectid);
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
    .filter((collection: BggCollectionResponse) => collection && collection.item && Array.isArray(collection.item))
    .reduce(
      (accum: any[], collection: BggCollectionResponse) => [
        ...accum,
        ...(collection.item || []),
      ],
      []
    )
    .reduce(
      (accum, bgg) => {
        const gameId = String(bgg.objectid);
        const owners = gameOwnersMap.get(gameId) || [];
        
        return {
          ...accum,
          [gameId]: {
            ...bgg,
            owners: owners.map(username => ({
              username,
              status: { own: 1 }, // Default status
              collid: `${username}_${gameId}` // Generate a unique collid
            })),
          },
        };
      },
      {}
    );

  return {
    collections: collections,
    boardgames: Object.values(boardgames),
  };
};
