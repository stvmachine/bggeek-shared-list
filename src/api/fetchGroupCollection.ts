import {
  getBggCollection,
  BggCollectionParams,
  BggCollectionResponse,
} from "bgg-xml-api-client";
import { ICollection, IItem } from "../utils/types";

export const fetchCollections = async (
  usernames: string[],
  options?: Partial<BggCollectionParams>
): Promise<ICollection[]> =>
  Promise.all(usernames.map((username) => fetchCollection(username, options)));

export const fetchCollection = async (
  username: string,
  options?: Partial<BggCollectionParams>
): Promise<ICollection> => {
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

  return {
    totalitems: collectionResponse.totalitems.toString(),
    pubdate: collectionResponse.pubdate,
    termsofuse: collectionResponse.termsofuse,
    item: collectionResponse?.item && Array.isArray(collectionResponse.item)
      ? collectionResponse.item.map((item) => ({
          yearpublished: item.yearpublished.toString(),
          stats: {
            maxplayers: item.stats?.maxplayers || 0,
            maxplaytime: item.stats?.maxplaytime || 0,
            minplayers: item.stats?.minplayers || 0,
            minplaytime: item.stats?.minplaytime || 0,
            numowned: item.stats?.numowned || 0,
            playingtime: item.stats?.playingtime || 0,
            rating: {
              average: { value: item.stats?.rating?.average?.value || 0 },
              bayesaverage: {
                value: item.stats?.rating?.bayesaverage?.value || 0,
              },
              median: { value: item.stats?.rating?.median?.value || 0 },
              ranks: {
                rank: (item.stats?.rating?.ranks?.rank || []).map((rank) => ({
                  bayesaverage: rank.bayesaverage || 0,
                  friendlyname: rank.friendlyname || "",
                  id: rank.id || 0,
                  name: rank.name || "",
                  type: (rank.type as any) || "boardgame",
                  value: rank.value || 0,
                })),
              },
              stddev: { value: item.stats?.rating?.stddev?.value || 0 },
              usersrated: { value: item.stats?.rating?.usersrated?.value || 0 },
            },
          },
          subtype: item.subtype as any,
          objectid: item.objectid.toString(),
          thumbnail: item.thumbnail || null,
          name: {
            text: item.name.text,
            sortIndex: item.name.sortindex.toString(),
          },
          owners: [
            {
              username,
              status: item.status,
              collid: item.collid?.toString() || "",
            },
          ],
        }))
      : [],
    username,
  } as ICollection;
};

export const mergeCollections = (
  rawData: ICollection[]
): { boardgames: IItem[]; collections: ICollection[] } => {
  const collections = rawData.map((item: ICollection) => {
    const { totalitems, pubdate, username } = item || {};
    return {
      totalitems,
      pubdate,
      username,
    };
  });

  const boardgames = rawData
    .filter((collection: ICollection) => collection && collection.item && Array.isArray(collection.item))
    .reduce(
      (accum: any[], collection: ICollection) => [
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
          owners: [
            ...(accum[`${bgg.objectid}`] && accum[`${bgg.objectid}`].owners
              ? accum[`${bgg.objectid}`].owners
              : []),
            ...bgg.owners,
          ],
        },
      }),
      {}
    );

  return {
    collections: collections,
    boardgames: Object.values(boardgames),
  };
};
