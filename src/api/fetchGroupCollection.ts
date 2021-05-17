import { BggCollectionResponse, getBggCollection } from "bgg-xml-api-client";
import { ICollection, IItem } from "../utils/types";

export const fetchCollections = async (
  usernames: string[]
): Promise<ICollection[]> =>
  Promise.all(usernames.map((username) => fetchCollection(username)));

export const fetchCollection = async (
  username: string
): Promise<ICollection> => {
  const collectionResponse = await getBggCollection({
    own: 1,
    subtype: "boardgame",
    stats: 1,
    username,
  });

  return {
    ...collectionResponse.data,
    item: collectionResponse.data.item.map((item: IItem) => ({
      yearpublished: item.yearpublished,
      stats: item.stats,
      subtype: item.subtype,
      objectid: item.objectid,
      thumbnail: item.thumbnail,
      name: { ...item.name },
      owners: [
        {
          username,
          status: item.status,
          collid: item.collid,
        },
      ],
    })),
    username,
  } as ICollection;
};

export const mergeCollections = (
  rawData: ICollection[]
): { boardgames: IItem[]; collections: ICollection[] } => {
  const collections = rawData.map(({ totalitems, pubdate, username }: any) => ({
    totalitems,
    pubdate,
    username,
  }));

  const boardgames = rawData
    .reduce(
      (accum: any[], collection: BggCollectionResponse) => [
        ...accum,
        ...collection.item,
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
