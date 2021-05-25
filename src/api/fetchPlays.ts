import { getBggPlays, getBggThing } from "bgg-xml-api-client";
import { IItem, IPlay } from "../utils/types";

export const getUniqueBgsFromPlays = async (
  plays: IPlay[]
): Promise<IItem[]> => {
  const uniqueBgIds = plays
    .map((play: IPlay) => Number(play.item.objectid))
    .filter(
      (value: number, index: number, self: number[]) =>
        self.indexOf(value) === index
    );
  const uniqueBgs = uniqueBgIds && (await getBggThing({ id: uniqueBgIds }));
  return uniqueBgs?.data?.item || [];
};

export const getPlaysAndRelatedBggs = async (
  bggeekUsername: string
): Promise<{ bgs: IItem[]; plays: IPlay[] }> => {
  const plays = await getBggPlays({ username: bggeekUsername });
  const uniqueBgs =
    plays?.data?.play && (await getUniqueBgsFromPlays(plays.data.play));

  return {
    plays: plays?.data?.play || [],
    bgs: uniqueBgs,
  };
};
