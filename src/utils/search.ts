import { ICollectionItem } from "../types";

export const filterByNumPlayers = (
  boardgames: ICollectionItem[],
  numberOfPlayers: number | string
) => {
  if (!numberOfPlayers || numberOfPlayers === "") return boardgames;

  return boardgames.filter(
    (bg: ICollectionItem) =>
      Number(bg.stats.maxPlayers) >= Number(numberOfPlayers) &&
      Number(bg.stats.minPlayers) <= Number(numberOfPlayers)
  );
};

export const filterByPlayingTime = (
  boardgames: ICollectionItem[],
  playingTime: number | string
) => {
  if (!playingTime || playingTime === "") return boardgames;

  const time = Number(playingTime);
  return boardgames.filter((bg: ICollectionItem) => {
    if (time === 1 && bg.stats.maxPlayTime <= 30) return true;
    if (time === 2 && bg.stats.maxPlayTime > 30 && bg.stats.maxPlayTime <= 60)
      return true;
    if (
      time === 3 &&
      bg.stats.maxPlayTime > 60 &&
      bg.stats.maxPlayTime <= 60 * 2
    )
      return true;
    if (
      time === 4 &&
      bg.stats.maxPlayTime > 60 * 2 &&
      bg.stats.maxPlayTime <= 60 * 3
    )
      return true;
    if (
      time === 5 &&
      bg.stats.maxPlayTime > 60 * 3 &&
      bg.stats.maxPlayTime <= 60 * 4
    )
      return true;
    if (time === 6 && bg.stats.maxPlayTime > 60 * 4) return true;
    return false;
  });
};

const checkAsc = (a: number | string, b: number | string, orderBy: string) => {
  if (orderBy.match("desc")) {
    return a > b ? -1 : 1;
  }
  return a > b ? 1 : -1;
};

export const orderByFn = (boardgames: ICollectionItem[], orderBy: string) => {
  if (!boardgames) return [];

  const games = [...boardgames];

  if (orderBy.match("rating")) {
    return games.sort((a, b) =>
      checkAsc(a.stats.average || 0, b.stats.average || 0, orderBy)
    );
  } else if (orderBy.match("year")) {
    return games.sort((a, b) =>
      checkAsc(a.yearPublished || 0, b.yearPublished || 0, orderBy)
    );
  } else {
    return games.sort((a, b) => {
      const nameA =
        typeof a.name === "string" ? a.name : (a.name as any)?.text || "";
      const nameB =
        typeof b.name === "string" ? b.name : (b.name as any)?.text || "";
      return checkAsc(nameA, nameB, orderBy);
    });
  }
};
