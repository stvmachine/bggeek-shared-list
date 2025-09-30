import { ICollectionItem } from "../../types";
import { filterByNumPlayers, filterByPlayingTime, orderByFn } from "../search";

// Mock game data for testing
const mockGames: ICollectionItem[] = [
  {
    objectId: "1",
    name: "Short Game",
    stats: {
      minPlayers: 1,
      maxPlayers: 4,
      minPlayTime: 15,
      maxPlayTime: 30,
      playingTime: 20,
      average: 7.5,
    },
    yearPublished: 2020,
    // collId: "1",
    image: "",
    numPlays: 0,
    objectType: "boardgame" as any,
    status: {} as any,
    subtype: "boardgame" as any,
    thumbnail: "",
    owners: [{ username: "testuser", collid: "1" }],
  },
  {
    objectId: "2",
    name: "Medium Game",
    stats: {
      minPlayers: 2,
      maxPlayers: 6,
      minPlayTime: 45,
      maxPlayTime: 90,
      playingTime: 60,
      average: 8.2,
    },
    yearPublished: 2019,
    // collId: "2",
    image: "",
    numPlays: 0,
    objectType: "boardgame" as any,
    status: {} as any,
    subtype: "boardgame" as any,
    thumbnail: "",
    owners: [{ username: "testuser", collid: "2" }],
  },
  {
    objectId: "3",
    name: "Long Game",
    stats: {
      minPlayers: 3,
      maxPlayers: 8,
      minPlayTime: 120,
      maxPlayTime: 240,
      playingTime: 180,
      average: 9.1,
    },
    yearPublished: 2021,
    // collId: "3",
    image: "",
    numPlays: 0,
    objectType: "boardgame" as any,
    status: {} as any,
    subtype: "boardgame" as any,
    thumbnail: "",
    owners: [{ username: "testuser", collid: "3" }],
  },
  {
    objectId: "4",
    name: "Two Player Game",
    stats: {
      minPlayers: 2,
      maxPlayers: 2,
      minPlayTime: 30,
      maxPlayTime: 45,
      playingTime: 35,
      average: 8.8,
    },
    yearPublished: 2018,
    // collId: "4",
    image: "",
    numPlays: 0,
    objectType: "boardgame" as any,
    status: {} as any,
    subtype: "boardgame" as any,
    thumbnail: "",
    owners: [{ username: "testuser", collid: "4" }],
  },
] as ICollectionItem[];

describe("Search Utilities", () => {
  describe("filterByNumPlayers", () => {
    it("should return all games when numberOfPlayers is empty", () => {
      const result = filterByNumPlayers(mockGames, "");
      expect(result).toHaveLength(4);
    });

    it("should return all games when numberOfPlayers is 0", () => {
      const result = filterByNumPlayers(mockGames, 0);
      expect(result).toHaveLength(4);
    });

    it("should filter games that support 1 player", () => {
      const result = filterByNumPlayers(mockGames, 1);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Short Game");
    });

    it("should filter games that support 2 players", () => {
      const result = filterByNumPlayers(mockGames, 2);
      expect(result).toHaveLength(3); // Short Game (1-4), Medium Game (2-6), Two Player Game (2-2)
    });

    it("should filter games that support 4 players", () => {
      const result = filterByNumPlayers(mockGames, 4);
      expect(result).toHaveLength(3);
      expect(result.map(g => g.name)).toEqual([
        "Short Game",
        "Medium Game",
        "Long Game",
      ]);
    });

    it("should filter games that support 6 players", () => {
      const result = filterByNumPlayers(mockGames, 6);
      expect(result).toHaveLength(2);
      expect(result.map(g => g.name)).toEqual(["Medium Game", "Long Game"]);
    });

    it("should return empty array when no games support the player count", () => {
      const result = filterByNumPlayers(mockGames, 10);
      expect(result).toHaveLength(0);
    });

    it("should handle string input for numberOfPlayers", () => {
      const result = filterByNumPlayers(mockGames, "3");
      expect(result).toHaveLength(3); // Short Game (1-4), Medium Game (2-6), Long Game (3-8)
      expect(result.map(g => g.name)).toEqual([
        "Short Game",
        "Medium Game",
        "Long Game",
      ]);
    });
  });

  describe("filterByPlayingTime", () => {
    it("should return all games when playingTime is empty", () => {
      const result = filterByPlayingTime(mockGames, "");
      expect(result).toHaveLength(4);
    });

    it("should return all games when playingTime is 0", () => {
      const result = filterByPlayingTime(mockGames, 0);
      expect(result).toHaveLength(4);
    });

    it("should filter games for time category 1 (≤30 minutes)", () => {
      const result = filterByPlayingTime(mockGames, 1);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Short Game");
    });

    it("should filter games for time category 2 (31-60 minutes)", () => {
      const result = filterByPlayingTime(mockGames, 2);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Two Player Game");
    });

    it("should filter games for time category 3 (61-120 minutes)", () => {
      const result = filterByPlayingTime(mockGames, 3);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Medium Game");
    });

    it("should filter games for time category 4 (121-180 minutes)", () => {
      const result = filterByPlayingTime(mockGames, 4);
      expect(result).toHaveLength(0); // Long Game has maxPlayTime: 240, so it's in category 5
    });

    it("should filter games for time category 5 (181-240 minutes)", () => {
      const result = filterByPlayingTime(mockGames, 5);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Long Game");
    });

    it("should filter games for time category 6 (>240 minutes)", () => {
      const result = filterByPlayingTime(mockGames, 6);
      expect(result).toHaveLength(0);
    });

    it("should handle string input for playingTime", () => {
      const result = filterByPlayingTime(mockGames, "1");
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Short Game");
    });
  });

  describe("orderByFn", () => {
    it("should return empty array when boardgames is null/undefined", () => {
      expect(orderByFn(null as any, "name_asc")).toEqual([]);
      expect(orderByFn(undefined as any, "name_asc")).toEqual([]);
    });

    it("should sort by name ascending", () => {
      const result = orderByFn(mockGames, "name_asc");
      expect(result[0].name).toBe("Long Game");
      expect(result[1].name).toBe("Medium Game");
      expect(result[2].name).toBe("Short Game");
      expect(result[3].name).toBe("Two Player Game");
    });

    it("should sort by name descending", () => {
      const result = orderByFn(mockGames, "name_desc");
      expect(result[0].name).toBe("Two Player Game");
      expect(result[1].name).toBe("Short Game");
      expect(result[2].name).toBe("Medium Game");
      expect(result[3].name).toBe("Long Game");
    });

    it("should sort by rating ascending", () => {
      const result = orderByFn(mockGames, "rating_asc");
      expect(result[0].stats.average).toBe(7.5);
      expect(result[1].stats.average).toBe(8.2);
      expect(result[2].stats.average).toBe(8.8);
      expect(result[3].stats.average).toBe(9.1);
    });

    it("should sort by rating descending", () => {
      const result = orderByFn(mockGames, "rating_desc");
      expect(result[0].stats.average).toBe(9.1);
      expect(result[1].stats.average).toBe(8.8);
      expect(result[2].stats.average).toBe(8.2);
      expect(result[3].stats.average).toBe(7.5);
    });

    it("should sort by year ascending", () => {
      const result = orderByFn(mockGames, "year_asc");
      expect(result[0].yearPublished).toBe(2018);
      expect(result[1].yearPublished).toBe(2019);
      expect(result[2].yearPublished).toBe(2020);
      expect(result[3].yearPublished).toBe(2021);
    });

    it("should sort by year descending", () => {
      const result = orderByFn(mockGames, "year_desc");
      expect(result[0].yearPublished).toBe(2021);
      expect(result[1].yearPublished).toBe(2020);
      expect(result[2].yearPublished).toBe(2019);
      expect(result[3].yearPublished).toBe(2018);
    });

    it("should default to name sorting for unknown orderBy", () => {
      const result = orderByFn(mockGames, "unknown");
      expect(result[0].name).toBe("Long Game");
      expect(result[1].name).toBe("Medium Game");
      expect(result[2].name).toBe("Short Game");
      expect(result[3].name).toBe("Two Player Game");
    });

    it("should handle games with missing stats gracefully", () => {
      const gamesWithMissingStats: ICollectionItem[] = [
        {
          ...mockGames[0],
          stats: {
            ...mockGames[0].stats,
            average: undefined,
          },
        },
        {
          ...mockGames[1],
          yearPublished: undefined,
        },
      ] as ICollectionItem[];

      const resultByRating = orderByFn(gamesWithMissingStats, "rating_asc");
      expect(resultByRating).toHaveLength(2);

      const resultByYear = orderByFn(gamesWithMissingStats, "year_asc");
      expect(resultByYear).toHaveLength(2);
    });
  });
});
