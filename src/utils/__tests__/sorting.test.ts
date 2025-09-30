import { ICollectionItem } from "../../types";
import { sortGames } from "../sorting";

// Mock game data for testing
const mockGames: ICollectionItem[] = [
  {
    objectId: "1",
    name: "Zebra Game",
    stats: {
      minPlayers: 1,
      maxPlayers: 4,
      minPlayTime: 30,
      maxPlayTime: 60,
      playingTime: 45,
      average: 8.5,
    },
    yearPublished: 2020,
    collId: "1",
    image: "",
    numPlays: 0,
    objectType: "boardgame" as any,
    status: {} as any,
    subtype: "boardgame" as any,
    thumbnail: "",
    owners: [{ username: "testuser", collid: "1" }],
  } as ICollectionItem,
  {
    objectId: "2",
    name: "Alpha Game",
    stats: {
      minPlayers: 2,
      maxPlayers: 2,
      minPlayTime: 20,
      maxPlayTime: 30,
      playingTime: 25,
      average: 7.5,
    },
    yearPublished: 2019,
    collId: "2",
    image: "",
    numPlays: 0,
    objectType: "boardgame" as any,
    status: {} as any,
    subtype: "boardgame" as any,
    thumbnail: "",
    owners: [{ username: "testuser", collid: "2" }],
  } as ICollectionItem,
  {
    objectId: "3",
    name: "Beta Game",
    stats: {
      minPlayers: 3,
      maxPlayers: 6,
      minPlayTime: 60,
      maxPlayTime: 90,
      playingTime: 75,
      average: 9.2,
    },
    yearPublished: 2021,
    collId: "3",
    image: "",
    numPlays: 0,
    objectType: "boardgame" as any,
    status: {} as any,
    subtype: "boardgame" as any,
    thumbnail: "",
    owners: [{ username: "testuser", collid: "3" }],
  } as ICollectionItem,
] as ICollectionItem[];

describe("Sorting Utilities", () => {
  describe("sortGames", () => {
    it("should sort by name ascending", () => {
      const result = sortGames(mockGames, "name_asc");
      expect(result[0].name).toBe("Alpha Game");
      expect(result[1].name).toBe("Beta Game");
      expect(result[2].name).toBe("Zebra Game");
    });

    it("should sort by name descending", () => {
      const result = sortGames(mockGames, "name_desc");
      expect(result[0].name).toBe("Zebra Game");
      expect(result[1].name).toBe("Beta Game");
      expect(result[2].name).toBe("Alpha Game");
    });

    it("should sort by rating ascending", () => {
      const result = sortGames(mockGames, "rating_asc");
      expect(result[0].stats.average).toBe(7.5);
      expect(result[1].stats.average).toBe(8.5);
      expect(result[2].stats.average).toBe(9.2);
    });

    it("should sort by rating descending", () => {
      const result = sortGames(mockGames, "rating_desc");
      expect(result[0].stats.average).toBe(9.2);
      expect(result[1].stats.average).toBe(8.5);
      expect(result[2].stats.average).toBe(7.5);
    });

    it("should sort by year ascending", () => {
      const result = sortGames(mockGames, "year_asc");
      expect(result[0].yearPublished).toBe(2019);
      expect(result[1].yearPublished).toBe(2020);
      expect(result[2].yearPublished).toBe(2021);
    });

    it("should sort by year descending", () => {
      const result = sortGames(mockGames, "year_desc");
      expect(result[0].yearPublished).toBe(2021);
      expect(result[1].yearPublished).toBe(2020);
      expect(result[2].yearPublished).toBe(2019);
    });

    it("should return original array for unknown sort option", () => {
      const result = sortGames(mockGames, "unknown" as any);
      expect(result).toEqual(mockGames);
    });
  });
});
