import {
  groupGames,
  groupGamesByBestPlayers,
  groupGamesByPlayers,
  groupGamesByRating,
} from "../grouping";
import { CollectionItem } from "../../lib/graphql/generated/types";

// Mock game data for testing
const mockGames: CollectionItem[] = [
  {
    objectId: "1",
    name: { text: "Game 1", sortIndex: "1" },
    stats: {
      minplayers: 1,
      maxplayers: 4,
      minplaytime: 30,
      maxplaytime: 60,
      playingtime: 45,
      numowned: 100,
      rating: {
        average: { value: 8.5 },
        bayesaverage: { value: 8.2 },
        median: { value: 8.0 },
        ranks: { rank: [] },
        stddev: { value: 1.2 },
        usersrated: { value: 1000 },
      },
    },
    yearpublished: "2020",
    collid: "1",
    image: "",
    numplays: "0",
    objectype: "boardgame" as any,
    status: {} as any,
    subtype: "boardgame" as any,
    thumbnail: "",
    owners: [{ username: "testuser", status: {}, collid: "1" }],
  },
  {
    objectId: "2",
    name: { text: "Game 2", sortIndex: "2" },
    stats: {
      minplayers: 2,
      maxplayers: 2,
      minplaytime: 20,
      maxplaytime: 30,
      playingtime: 25,
      numowned: 50,
      rating: {
        average: { value: 7.5 },
        bayesaverage: { value: 7.3 },
        median: { value: 7.0 },
        ranks: { rank: [] },
        stddev: { value: 1.0 },
        usersrated: { value: 500 },
      },
    },
    yearpublished: "2019",
    collid: "2",
    image: "",
    numplays: "0",
    objectype: "boardgame" as any,
    status: {} as any,
    subtype: "boardgame" as any,
    thumbnail: "",
    owners: [{ username: "testuser", status: {}, collid: "2" }],
  },
  {
    objectId: "3",
    name: { text: "Game 3", sortIndex: "3" },
    stats: {
      minplayers: 3,
      maxplayers: 6,
      minplaytime: 60,
      maxplaytime: 90,
      playingtime: 75,
      numowned: 200,
      rating: {
        average: { value: 9.2 },
        bayesaverage: { value: 9.0 },
        median: { value: 9.0 },
        ranks: { rank: [] },
        stddev: { value: 0.8 },
        usersrated: { value: 2000 },
      },
    },
    yearpublished: "2021",
    collid: "3",
    image: "",
    numplays: "0",
    objectype: "boardgame" as any,
    status: {} as any,
    subtype: "boardgame" as any,
    thumbnail: "",
    owners: [{ username: "testuser", status: {}, collid: "3" }],
  },
] as CollectionItem[];

describe("Grouping Utilities", () => {
  describe("groupGamesByPlayers", () => {
    it("should group games by player count correctly", () => {
      const result = groupGamesByPlayers(mockGames);

      expect(Object.keys(result)).toHaveLength(3);
      expect(result["1-4 Players"]).toHaveLength(1);
      expect(result["2 Players"]).toHaveLength(1);
      expect(result["3-6 Players"]).toHaveLength(1);
    });

    it("should sort groups by minimum player count", () => {
      const result = groupGamesByPlayers(mockGames);
      const groupNames = Object.keys(result);

      expect(groupNames[0]).toBe("1-4 Players");
      expect(groupNames[1]).toBe("2 Players");
      expect(groupNames[2]).toBe("3-6 Players");
    });
  });

  describe("groupGamesByRating", () => {
    it("should group games by rating ranges correctly", () => {
      const result = groupGamesByRating(mockGames);

      expect(result["9.0+ (Excellent)"]).toHaveLength(1);
      expect(result["8.0-8.9 (Very Good)"]).toHaveLength(1);
      expect(result["7.0-7.9 (Good)"]).toHaveLength(1);
    });

    it("should not include empty groups", () => {
      const result = groupGamesByRating(mockGames);

      expect(result["Below 6.0 (Poor)"]).toBeUndefined();
      expect(result["Unrated"]).toBeUndefined();
    });
  });

  describe("groupGamesByBestPlayers", () => {
    it("should group games by best player count correctly", () => {
      const result = groupGamesByBestPlayers(mockGames);

      expect(Object.keys(result)).toHaveLength(3);
      expect(result["Best with 4 players"]).toHaveLength(1); // 1-4 range -> 4 players (upper 2/3)
      expect(result["Best with 2 players"]).toHaveLength(1); // 2-2 range -> 2 players
      expect(result["Best with 6 players"]).toHaveLength(1); // 3-6 range -> 6 players (upper 2/3)
    });

    it("should sort groups by player count", () => {
      const result = groupGamesByBestPlayers(mockGames);
      const groupNames = Object.keys(result);

      expect(groupNames[0]).toBe("Best with 2 players");
      expect(groupNames[1]).toBe("Best with 4 players");
      expect(groupNames[2]).toBe("Best with 6 players");
    });

    it("should handle single player games correctly", () => {
      const singlePlayerGame: CollectionItem = {
        ...mockGames[0],
        stats: {
          ...mockGames[0].stats,
          minplayers: 1,
          maxplayers: 1,
        },
      };

      const result = groupGamesByBestPlayers([singlePlayerGame]);

      expect(Object.keys(result)).toHaveLength(1);
      expect(result["Best with 1 player"]).toHaveLength(1);
    });
  });

  describe("groupGames", () => {
    it('should return ungrouped games when groupBy is "none"', () => {
      const result = groupGames(mockGames, "none");

      expect(Object.keys(result)).toHaveLength(1);
      expect(result["All Games"]).toHaveLength(3);
    });

    it('should group by players when groupBy is "players"', () => {
      const result = groupGames(mockGames, "players");

      expect(Object.keys(result)).toHaveLength(3);
      expect(result["1-4 Players"]).toHaveLength(1);
    });

    it('should group by rating when groupBy is "rating"', () => {
      const result = groupGames(mockGames, "rating");

      expect(Object.keys(result)).toHaveLength(3);
      expect(result["9.0+ (Excellent)"]).toHaveLength(1);
    });

    it('should group by best players when groupBy is "bestPlayers"', () => {
      const result = groupGames(mockGames, "bestPlayers");

      expect(Object.keys(result)).toHaveLength(3);
      expect(result["Best with 2 players"]).toHaveLength(1);
      expect(result["Best with 4 players"]).toHaveLength(1);
      expect(result["Best with 6 players"]).toHaveLength(1);
    });
  });
});
