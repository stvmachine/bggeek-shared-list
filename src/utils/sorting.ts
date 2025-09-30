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
      return sortedGames.sort((a, b) => {
        const nameA = typeof a.name === "string" ? a.name : (a.name as any)?.text || "";
        const nameB = typeof b.name === "string" ? b.name : (b.name as any)?.text || "";
        return nameA.localeCompare(nameB);
      });

    case "name_desc":
      return sortedGames.sort((a, b) => {
        const nameA = typeof a.name === "string" ? a.name : (a.name as any)?.text || "";
        const nameB = typeof b.name === "string" ? b.name : (b.name as any)?.text || "";
        return nameB.localeCompare(nameA);
      });

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
