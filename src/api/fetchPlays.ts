import { getBggPlays, getBggThing } from "bgg-xml-api-client";
import { IItem, IPlay, IGame, IBgDict, IPlayer } from "../utils/types";

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
): Promise<{ bgs: IBgDict; plays: IPlay[] }> => {
  const rawPlays = await getBggPlays({ username: bggeekUsername });
  const uniqueBgs =
    rawPlays?.data?.play && (await getUniqueBgsFromPlays(rawPlays.data.play));

  let plays = rawPlays?.data?.play || [];
  plays = plays.map((play: any) => ({
    ...play,
    players: play.players.player,
  }));

  plays = plays.map((play: IPlay) => ({
    ...play,
    players: [
      ...play.players.filter(
        ({ name }: IPlayer) => !name.includes("Anonymous player")
      ),
      ...play.players.filter(({ name }: IPlayer) =>
        name.includes("Anonymous player")
      ),
    ],
  }));

  return {
    plays,
    bgs: uniqueBgs.reduce(
      (accum: IBgDict, bg: IGame) => ({
        ...accum,
        [bg.id]: bg,
      }),
      {}
    ),
  };
};
