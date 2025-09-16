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
  rawData: BggCollectionResponse[]
): { boardgames: any[]; collections: BggCollectionResponse[] } => {
  const collections = rawData.map((item: BggCollectionResponse) => {
    const { totalitems, pubdate } = item || {};
    return {
      totalitems,
      pubdate,
    };
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
      (accum, bgg) => ({
        ...accum,
        [`${bgg.objectid}`]: {
          ...bgg,
        },
      }),
      {}
    );

  return {
    collections: collections,
    boardgames: Object.values(boardgames),
  };
};
