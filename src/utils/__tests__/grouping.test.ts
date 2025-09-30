import { ICollectionItem } from "../../types";
import {
  groupGames,
  groupGamesByBestPlayers,
  groupGamesByPlayers,
  groupGamesByRating,
} from "../grouping";

// Mock game data for testing
const mockGames: ICollectionItem[] = [
  {
    objectId: "1",
    name: { text: "Game 1", sortIndex: "1" },
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
    name: { text: "Game 2", sortIndex: "2" },
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
    name: { text: "Game 3", sortIndex: "3" },
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
      const singlePlayerGame: ICollectionItem = {
        ...mockGames[0],
        stats: {
          ...mockGames[0].stats,
          minPlayers: 1,
          maxPlayers: 1,
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
