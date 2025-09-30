import { ICollectionItem } from "../types";

export type SortOption =
  | "name_asc"
  | "name_desc"
  | "rating_asc"
  | "rating_desc"
  | "year_asc"
  | "year_desc";

export const sortGames = (
  games: ICollectionItem[],
  sortBy: SortOption
): ICollectionItem[] => {
  const sortedGames = [...games];

  switch (sortBy) {
    case "name_asc":
      return sortedGames.sort((a, b) => a.name.localeCompare(b.name));

    case "name_desc":
      return sortedGames.sort((a, b) => b.name.localeCompare(a.name));

    case "rating_asc":
      return sortedGames.sort((a, b) => {
        const ratingA = a.stats.average || 0;
        const ratingB = b.stats.average || 0;
        return ratingA - ratingB;
      });

    case "rating_desc":
      return sortedGames.sort((a, b) => {
        const ratingA = a.stats.average || 0;
        const ratingB = b.stats.average || 0;
        return ratingB - ratingA;
      });

    case "year_asc":
      return sortedGames.sort((a, b) => {
        const yearA = a.yearPublished || 0;
        const yearB = b.yearPublished || 0;
        return yearA - yearB;
      });

    case "year_desc":
      return sortedGames.sort((a, b) => {
        const yearA = a.yearPublished || 0;
        const yearB = b.yearPublished || 0;
        return yearB - yearA;
      });

    default:
      return sortedGames;
  }
};
