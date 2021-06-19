import { getBggPlays, getBggThing } from "bgg-xml-api-client";
import {
  IItem,
  IPlay,
  IGame,
  IBgDict,
  IPlaysByDateDict,
  IPlayer,
} from "../utils/types";

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
  bggUsername: string
): Promise<{ bgs: IBgDict; plays: IPlaysByDateDict }> => {
  const rawPlays = await getBggPlays({ username: bggUsername });

  // Boardgames
  const uniqueBgs =
    rawPlays?.data?.play && (await getUniqueBgsFromPlays(rawPlays.data.play));
  const bgs = uniqueBgs
    ? uniqueBgs.reduce(
        (accum: IBgDict, bg: IGame) => ({
          ...accum,
          [bg.id]: bg,
        }),
        {}
      )
    : {};

  // Plays
  let plays = rawPlays?.data?.play || [];
  plays = plays.map((play: any) => ({
    ...play,
    players: play.players.player,
  }));

  const playsDict: IPlaysByDateDict = plays
    .map((play: IPlay) => ({
      ...play,
      players:
        play.players.length > 0
          ? [
              ...play.players.filter(
                ({ name }: IPlayer) => !name.includes("Anonymous player")
              ),
              ...play.players.filter(({ name }: IPlayer) =>
                name.includes("Anonymous player")
              ),
            ]
          : [],
    }))
    .reduce((accum: IPlaysByDateDict, play: IPlay) => {
      return {
        ...accum,
        [play.date]: [...(accum[play.date] ? accum[play.date] : []), play],
      };
    }, {});

  return {
    plays: playsDict,
    bgs,
  };
};
