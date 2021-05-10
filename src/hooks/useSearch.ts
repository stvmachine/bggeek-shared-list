import Fuse, { FuseOptions } from "fuse.js";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";

import { ItemType } from "../utils/types";

export interface IFuzzyClient<T> {
  results: T[];
}

export const filterByNumPlayers = (
  boardgames: ItemType[],
  numberOfPlayers: number
) =>
  numberOfPlayers
    ? boardgames.filter(
        (bg: ItemType) =>
          bg.stats.maxplayers >= numberOfPlayers &&
          bg.stats.minplayers <= numberOfPlayers
      )
    : boardgames;

export const filterByPlayingTime = (
  boardgames: ItemType[],
  playingTime: number
) =>
  playingTime
    ? boardgames.filter((bg: ItemType) => {
        if (playingTime == 1 && bg.stats.maxplaytime <= 30) {
          return true;
        }
        if (
          playingTime == 2 &&
          bg.stats.maxplaytime > 30 &&
          bg.stats.maxplaytime <= 60
        ) {
          return true;
        }
        if (
          playingTime == 3 &&
          bg.stats.maxplaytime > 60 &&
          bg.stats.maxplaytime <= 60 * 2
        ) {
          return true;
        }
        if (
          playingTime == 4 &&
          bg.stats.maxplaytime > 60 * 2 &&
          bg.stats.maxplaytime <= 60 * 3
        ) {
          return true;
        }
        if (
          playingTime == 5 &&
          bg.stats.maxplaytime > 60 * 3 &&
          bg.stats.maxplaytime <= 60 * 4
        ) {
          return true;
        }
        if (playingTime == 6 && bg.stats.maxplaytime > 60 * 4) {
          return true;
        }
        return false;
      })
    : boardgames;

export const orderByFn = (boardgames: ItemType[], orderBy: string) => {
  if (orderBy == "rating") {
    return boardgames.sort((a, b) =>
      a.stats.rating.bayesaverage.value > b.stats.rating.bayesaverage.value
        ? -1
        : 1
    );
  } else if (orderBy == "numowned") {
    return boardgames.sort((a, b) =>
      a.stats.numowned > b.stats.numowned ? -1 : 1
    );
  } else if (orderBy == "year") {
    return boardgames.sort((a, b) =>
      a.yearpublished > b.yearpublished ? -1 : 1
    );
  } else {
    return boardgames.sort((a, b) => (a.name.text > b.name.text ? 1 : -1));
  }
};
export function useSearch<T>(
  data: T[],
  options: FuseOptions<T>
): IFuzzyClient<T> {
  const { watch } = useFormContext();
  const watchAllFields = watch();
  const { keyword, orderBy, ...otherFields } = watchAllFields;

  const searcher = useMemo(() => {
    const defaultOptions = { tokenize: true, threshold: 0.2 };
    return new Fuse(data, { ...defaultOptions, ...options });
  }, [data, options]);

  const results = useMemo(() => {
    let results: any = data;
    const { playingTime, numberOfPlayers } = otherFields;
    results = keyword ? (searcher.search(keyword) as T[]) : results;
    results = filterByPlayingTime(results, playingTime);
    results = filterByNumPlayers(results, numberOfPlayers);
    results = orderByFn(results, orderBy);
    return results;
  }, [
    data,
    keyword,
    orderBy,
    otherFields.playingTime,
    otherFields.numberOfPlayers,
  ]);

  return {
    results,
  };
}
