import Fuse, { FuseOptions } from "fuse.js";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";

import useDebounce from "./useDebounce";
import { BggCollectionItem } from "../utils/types";

export interface IFuzzyClient<T> {
  results: T[];
}

export const filterByNumPlayers = (
  boardgames: BggCollectionItem[],
  numberOfPlayers: number
) =>
  numberOfPlayers
    ? boardgames.filter(
        (bg: BggCollectionItem) =>
          Number(bg.stats.maxplayers) >= numberOfPlayers &&
          Number(bg.stats.minplayers) <= numberOfPlayers
      )
    : boardgames;

export const filterByPlayingTime = (boardgames: IItem[], playingTime: number) =>
  playingTime
    ? boardgames.filter((bg: IItem) => {
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

export const filterByUsers = (boardgames: IItem[], usernames: string[]) =>
  boardgames.filter(
    (bg: IItem) =>
      bg.owners?.filter((o) => usernames.includes(o.username))?.length
  );

const checkAsc = (a: number | string, b: number | string, orderBy: string) => {
  if (orderBy.match("desc")) {
    return a > b ? -1 : 1;
  }
  return a > b ? 1 : -1;
};

export const orderByFn = (boardgames: IItem[], orderBy: string) => {
  if (orderBy.match("rating")) {
    return boardgames.sort((a, b) =>
      checkAsc(
        a.stats.rating.bayesaverage.value,
        b.stats.rating.bayesaverage.value,
        orderBy
      )
    );
  } else if (orderBy.match("numowned")) {
    return boardgames.sort((a, b) =>
      checkAsc(a.stats.numowned, b.stats.numowned, orderBy)
    );
  } else if (orderBy.match("year")) {
    return boardgames.sort((a, b) =>
      checkAsc(a.yearpublished, b.yearpublished, orderBy)
    );
  } else {
    return boardgames.sort((a, b) =>
      checkAsc(a.name.text, b.name.text, orderBy)
    );
  }
};
export function useSearch<T>(
  data: T[],
  options: FuseOptions<T>
): IFuzzyClient<T> {
  const { watch } = useFormContext();
  const watchAllFields = watch();
  const { keyword, members, orderBy, ...otherFields } = watchAllFields;

  const searcher = useMemo(() => {
    const defaultOptions = { tokenize: true, threshold: 0.2 };
    return new Fuse(data, { ...defaultOptions, ...options });
  }, [data, options]);

  const debouncedValue = useDebounce(
    [
      data,
      keyword,
      orderBy,
      otherFields.playingTime,
      otherFields.numberOfPlayers,
      JSON.stringify(members),
    ],
    500
  );

  const results = useMemo(() => {
    let results: any = data;
    const { playingTime, numberOfPlayers } = otherFields;
    results = keyword ? (searcher.search(keyword) as T[]) : results;
    const filteredMembers = Object.keys(members).reduce(
      (accum: string[], key: string) => {
        if (members[key]) {
          accum.push(key);
        }
        return accum;
      },
      []
    );
    results = filterByUsers(results, filteredMembers);
    results = filterByPlayingTime(results, Number(playingTime));
    results = filterByNumPlayers(results, Number(numberOfPlayers));
    results = orderByFn(results, orderBy);

    return results;
  }, [...debouncedValue]);

  return {
    results,
  };
}
