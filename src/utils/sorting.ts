import { BggCollectionItem } from './types';

export type SortOption =
  | "name_asc"
  | "name_desc"
  | "rating_asc"
  | "rating_desc"
  | "year_asc"
  | "year_desc";

export const sortGames = (
  games: BggCollectionItem[],
  sortBy: SortOption
): BggCollectionItem[] => {
  const sortedGames = [...games];

  switch (sortBy) {
    case "name_asc":
      return sortedGames.sort((a, b) => a.name.text.localeCompare(b.name.text));

    case "name_desc":
      return sortedGames.sort((a, b) => b.name.text.localeCompare(a.name.text));

    case "rating_asc":
      return sortedGames.sort((a, b) => {
        const ratingA = a.stats?.rating?.average?.value || 0;
        const ratingB = b.stats?.rating?.average?.value || 0;
        return ratingA - ratingB;
      });

    case "rating_desc":
      return sortedGames.sort((a, b) => {
        const ratingA = a.stats?.rating?.average?.value || 0;
        const ratingB = b.stats?.rating?.average?.value || 0;
        return ratingB - ratingA;
      });

    case "year_asc":
      return sortedGames.sort((a, b) => {
        const yearA = a.yearpublished || 0;
        const yearB = b.yearpublished || 0;
        return yearA - yearB;
      });

    case "year_desc":
      return sortedGames.sort((a, b) => {
        const yearA = a.yearpublished || 0;
        const yearB = b.yearpublished || 0;
        return yearB - yearA;
      });

    default:
      return sortedGames;
  }
};
