import { getBggCollection } from "bgg-xml-api-client";
import { ICollection, IItem } from "../utils/types";

export const fetchCollections = async (
  usernames: string[],
  options?: any
): Promise<ICollection[]> =>
  Promise.all(usernames.map((username) => fetchCollection(username, options)));

export const fetchCollection = async (
  username: string,
  options?: any
): Promise<ICollection> => {
  const collectionResponse = await getBggCollection({
    own: 1,
    subtype: "boardgame",
    stats: 1,
    username,
    ...options,
  });

  const data = collectionResponse.data || {};
  
  return {
    ...data,
    item: (data as any)?.item
      ? (data as any).item.map((item: IItem) => ({
          yearpublished: item.yearpublished,
          stats: item.stats,
          subtype: item.subtype,
          objectid: item.objectid,
          thumbnail: item.thumbnail ? item.thumbnail : null,
          name: { ...item.name },
          owners: [
            {
              username,
              status: item.status,
              collid: item.collid,
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
