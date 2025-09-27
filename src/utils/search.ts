import { BggCollectionItem } from "./types";

export const filterByNumPlayers = (
  boardgames: BggCollectionItem[],
  numberOfPlayers: number | string
) => {
  if (!numberOfPlayers || numberOfPlayers === "") return boardgames;

  return boardgames.filter(
    (bg: BggCollectionItem) =>
      Number(bg.stats.maxplayers) >= Number(numberOfPlayers) &&
      Number(bg.stats.minplayers) <= Number(numberOfPlayers)
  );
};

export const filterByPlayingTime = (
  boardgames: BggCollectionItem[],
  playingTime: number | string
) => {
  if (!playingTime || playingTime === "") return boardgames;

  const time = Number(playingTime);
  return boardgames.filter((bg: BggCollectionItem) => {
    if (time === 1 && bg.stats.maxplaytime <= 30) return true;
    if (time === 2 && bg.stats.maxplaytime > 30 && bg.stats.maxplaytime <= 60)
      return true;
    if (
      time === 3 &&
      bg.stats.maxplaytime > 60 &&
      bg.stats.maxplaytime <= 60 * 2
    )
      return true;
    if (
      time === 4 &&
      bg.stats.maxplaytime > 60 * 2 &&
      bg.stats.maxplaytime <= 60 * 3
    )
      return true;
    if (
      time === 5 &&
      bg.stats.maxplaytime > 60 * 3 &&
      bg.stats.maxplaytime <= 60 * 4
    )
      return true;
    if (time === 6 && bg.stats.maxplaytime > 60 * 4) return true;
    return false;
  });
};

const checkAsc = (a: number | string, b: number | string, orderBy: string) => {
  if (orderBy.match("desc")) {
    return a > b ? -1 : 1;
  }
  return a > b ? 1 : -1;
};

export const orderByFn = (boardgames: BggCollectionItem[], orderBy: string) => {
  if (!boardgames) return [];

  const games = [...boardgames];

  if (orderBy.match("rating")) {
    return games.sort((a, b) =>
      checkAsc(
        a.stats.rating?.bayesaverage?.value || 0,
        b.stats.rating?.bayesaverage?.value || 0,
        orderBy
      )
    );
  } else if (orderBy.match("numowned")) {
    return games.sort((a, b) =>
      checkAsc(a.stats.numowned || 0, b.stats.numowned || 0, orderBy)
    );
  } else if (orderBy.match("year")) {
    return games.sort((a, b) =>
      checkAsc(a.yearpublished || 0, b.yearpublished || 0, orderBy)
    );
  } else {
    return games.sort((a, b) =>
      checkAsc(a.name?.text || "", b.name?.text || "", orderBy)
    );
  }
};
