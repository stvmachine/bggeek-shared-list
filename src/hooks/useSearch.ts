import Fuse, { FuseOptions } from "fuse.js";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";

import { BggCollectionItem } from "../utils/types";

import useDebounce from "./useDebounce";

export interface IFuzzyClient<T> {
  results: T[];
}

export const filterByNumPlayers = (
  boardgames: BggCollectionItem[],
  numberOfPlayers: number | string
) =>
  numberOfPlayers && numberOfPlayers !== ""
    ? boardgames.filter(
        (bg: BggCollectionItem) =>
          Number(bg.stats.maxplayers) >= Number(numberOfPlayers) &&
          Number(bg.stats.minplayers) <= Number(numberOfPlayers)
      )
    : boardgames;

export const filterByPlayingTime = (
  boardgames: BggCollectionItem[],
  playingTime: number | string
) =>
  playingTime && playingTime !== ""
    ? boardgames.filter((bg: BggCollectionItem) => {
        const time = Number(playingTime);
        if (time == 1 && bg.stats.maxplaytime <= 30) {
          return true;
        }
        if (
          time == 2 &&
          bg.stats.maxplaytime > 30 &&
          bg.stats.maxplaytime <= 60
        ) {
          return true;
        }
        if (
          time == 3 &&
          bg.stats.maxplaytime > 60 &&
          bg.stats.maxplaytime <= 60 * 2
        ) {
          return true;
        }
        if (
          time == 4 &&
          bg.stats.maxplaytime > 60 * 2 &&
          bg.stats.maxplaytime <= 60 * 3
        ) {
          return true;
        }
        if (
          time == 5 &&
          bg.stats.maxplaytime > 60 * 3 &&
          bg.stats.maxplaytime <= 60 * 4
        ) {
          return true;
        }
        if (time == 6 && bg.stats.maxplaytime > 60 * 4) {
          return true;
        }
        return false;
      })
    : boardgames;

export const filterByUsers = (
  boardgames: BggCollectionItem[],
  usernames: string[]
) =>
  boardgames.filter(
    (bg: BggCollectionItem) =>
      bg.owners?.some((o: { username: string }) =>
        usernames.includes(o.username)
      )
  );

const checkAsc = (a: number | string, b: number | string, orderBy: string) => {
  if (orderBy.match("desc")) {
    return a > b ? -1 : 1;
  }
  return a > b ? 1 : -1;
};

export const orderByFn = (boardgames: BggCollectionItem[], orderBy: string) => {
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
  const keyword = watch("keyword");
  const members = watch("members");
  const orderBy = watch("orderBy");
  const playingTime = watch("playingTime");
  const numberOfPlayers = watch("numberOfPlayers");

  const searcher = useMemo(() => {
    const defaultOptions = { tokenize: true, threshold: 0.2 };
    return new Fuse(data, { ...defaultOptions, ...options });
  }, [data, options]);

  const debouncedValue = useDebounce(
    [
      data,
      keyword,
      orderBy,
      playingTime,
      numberOfPlayers,
      JSON.stringify(members),
    ],
    800
  );

  const results = useMemo((): T[] => {
    let currentResults: T[] = [...data];

    // Apply search if keyword exists
    if (keyword) {
      const searchResults = searcher.search(keyword);
      // Extract items from Fuse.js search results
      currentResults = searchResults.map((result: any) =>
        result.item ? result.item : result
      ) as T[];
    }

    // Filter by members who have the game
    const filteredMembers = Object.keys(members || {}).reduce(
      (accum: string[], key: string) => {
        if (members[key]) {
          accum.push(key);
        }
        return accum;
      },
      []
    );

    // Apply all filters
    currentResults = filterByUsers(
      currentResults as BggCollectionItem[],
      filteredMembers
    ) as T[];
    currentResults = filterByPlayingTime(
      currentResults as BggCollectionItem[],
      playingTime
    ) as T[];
    currentResults = filterByNumPlayers(
      currentResults as BggCollectionItem[],
      numberOfPlayers
    ) as T[];
    currentResults = orderByFn(
      currentResults as BggCollectionItem[],
      orderBy
    ) as T[];

    return currentResults;
  }, [...debouncedValue]);

  return {
    results,
  };
}
