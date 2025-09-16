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

export const filterByPlayingTime = (boardgames: BggCollectionItem[], playingTime: number) =>
  playingTime
    ? boardgames.filter((bg: BggCollectionItem) => {
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

export const filterByUsers = (boardgames: BggCollectionItem[], usernames: string[]) =>
  boardgames.filter(
    (bg: BggCollectionItem) =>
      bg.owners?.filter((o: { username: string }) => usernames.includes(o.username))?.length
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
    console.log('useSearch - initial data length:', data?.length);
    
    const { playingTime, numberOfPlayers } = otherFields;
    results = keyword ? (searcher.search(keyword) as T[]) : results;
    console.log('useSearch - after keyword search:', results?.length);
    
    const filteredMembers = Object.keys(members).reduce(
      (accum: string[], key: string) => {
        if (members[key]) {
          accum.push(key);
        }
        return accum;
      },
      []
    );
    console.log('useSearch - filteredMembers:', filteredMembers);
    
    results = filterByUsers(results, filteredMembers);
    console.log('useSearch - after filterByUsers:', results?.length);
    
    results = filterByPlayingTime(results, Number(playingTime));
    console.log('useSearch - after filterByPlayingTime:', results?.length);
    
    results = filterByNumPlayers(results, Number(numberOfPlayers));
    console.log('useSearch - after filterByNumPlayers:', results?.length);
    
    results = orderByFn(results, orderBy);
    console.log('useSearch - after orderByFn:', results?.length);

    return results;
  }, [...debouncedValue]);

  return {
    results,
  };
}
