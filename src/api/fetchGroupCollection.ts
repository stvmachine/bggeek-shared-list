import { BggCollectionResponse, getBggCollection } from "bgg-xml-api-client";
import { ICollection, IItem } from "../utils/types";

export const fetchGroupCollection = async (
  usernames: string[]
): Promise<{ boardgames: IItem[]; collections: ICollection[] }> => {
  const rawData = await Promise.all(
    usernames.map(async (username) => {
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
      };
    })
  );

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
    collections,
    boardgames: Object.values(boardgames) as IItem[],
  };
};
