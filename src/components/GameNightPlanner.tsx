import { Box, Button, Flex, Icon, Text, VStack, Wrap } from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import { FaClock, FaUsers, FaStar, FaGamepad } from "react-icons/fa";
import { BggCollectionItem } from "../utils/types";
// import GameCard from "./GameCard";

interface GameNightPlannerProps {
  games: BggCollectionItem[];
}

type GroupSize = "2-4" | "5-6" | "7+";
type PlayTime = "30-60min" | "1-2hrs" | "2+hrs";
type Complexity = "beginner" | "intermediate" | "advanced";
type GameType = "strategy" | "party" | "cooperative" | "competitive" | "all";

const GameNightPlanner: React.FC<GameNightPlannerProps> = ({ games }) => {
  const [groupSize, setGroupSize] = useState<GroupSize>("2-4");
  const [playTime, setPlayTime] = useState<PlayTime>("30-60min");
  const [complexity, setComplexity] = useState<Complexity>("beginner");
  const [gameType, setGameType] = useState<GameType>("all");

  // Filter games based on criteria
  const filteredGames = useMemo(() => {
    return games.filter(game => {
      // Group size filter
      const [minGroup, maxGroup] =
        groupSize === "2-4" ? [2, 4] : groupSize === "5-6" ? [5, 6] : [7, 20];

      const gameMinPlayers = game.stats?.minplayers || 0;
      const gameMaxPlayers = game.stats?.maxplayers || 0;

      if (gameMinPlayers > maxGroup || gameMaxPlayers < minGroup) {
        return false;
      }

      // Play time filter
      const gameTime = game.stats?.playingtime || 0;
      const [minTime, maxTime] =
        playTime === "30-60min"
          ? [30, 60]
          : playTime === "1-2hrs"
            ? [60, 120]
            : [120, 300];

      if (gameTime < minTime || gameTime > maxTime) {
        return false;
      }

      // Complexity filter (based on play time and player count)
      const complexityGameTime = game.stats?.playingtime || 0;
      const minPlayers = game.stats?.minplayers || 0;
      const maxPlayers = game.stats?.maxplayers || 0;

      // Simple complexity heuristic: longer games with more players tend to be more complex
      const complexityScore =
        complexityGameTime / 30 + (maxPlayers - minPlayers) / 2;

      if (complexity === "beginner" && complexityScore > 3) {
        return false;
      }
      if (
        complexity === "intermediate" &&
        (complexityScore < 2 || complexityScore > 6)
      ) {
        return false;
      }
      if (complexity === "advanced" && complexityScore < 4) {
        return false;
      }

      return true;
    });
  }, [games, groupSize, playTime, complexity, gameType]);

  // Get top 6 recommended games
  const recommendedGames = useMemo(() => {
    return filteredGames
      .sort((a, b) => {
        const ratingA = a.stats?.rating?.average?.value || 0;
        const ratingB = b.stats?.rating?.average?.value || 0;
        return ratingB - ratingA;
      })
      .slice(0, 6);
  }, [filteredGames]);

  const clearFilters = () => {
    setGroupSize("2-4");
    setPlayTime("30-60min");
    setComplexity("beginner");
    setGameType("all");
  };

  return (
    <Box p={6} bg="gray.50" borderRadius="xl" mb={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box textAlign="center">
          <Icon as={FaGamepad} boxSize={8} color="blue.500" mb={3} />
          <Text fontSize="2xl" fontWeight="bold" color="gray.800" mb={2}>
            🎲 Game Night Planner
          </Text>
          <Text color="gray.600" fontSize="lg">
            Find the perfect games for your group and create an unforgettable
            game night!
          </Text>
        </Box>

        {/* Filters */}
        <Box bg="white" p={6} borderRadius="xl" boxShadow="sm">
          <Text fontSize="lg" fontWeight="semibold" mb={4} color="gray.700">
            Filter Games for Your Group
          </Text>

          <Wrap spacing={4} mb={4}>
            {/* Group Size */}
            <Box minW="200px">
              <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.600">
                <Icon as={FaUsers} mr={2} />
                Group Size
              </Text>
              <select
                value={groupSize}
                onChange={e => setGroupSize(e.target.value as GroupSize)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  fontSize: "14px",
                  backgroundColor: "white",
                }}
              >
                <option value="2-4">2-4 Players</option>
                <option value="5-6">5-6 Players</option>
                <option value="7+">7+ Players</option>
              </select>
            </Box>

            {/* Play Time */}
            <Box minW="200px">
              <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.600">
                <Icon as={FaClock} mr={2} />
                Play Time
              </Text>
              <select
                value={playTime}
                onChange={e => setPlayTime(e.target.value as PlayTime)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  fontSize: "14px",
                  backgroundColor: "white",
                }}
              >
                <option value="30-60min">30-60 minutes</option>
                <option value="1-2hrs">1-2 hours</option>
                <option value="2+hrs">2+ hours</option>
              </select>
            </Box>

            {/* Complexity */}
            <Box minW="200px">
              <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.600">
                <Icon as={FaStar} mr={2} />
                Game Complexity
              </Text>
              <select
                value={complexity}
                onChange={e => setComplexity(e.target.value as Complexity)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  fontSize: "14px",
                  backgroundColor: "white",
                }}
              >
                <option value="beginner">Quick & Simple</option>
                <option value="intermediate">Moderate Complexity</option>
                <option value="advanced">Complex & Deep</option>
              </select>
            </Box>
          </Wrap>

          <Flex justify="space-between" align="center">
            <Text fontSize="sm" color="gray.500">
              Found {filteredGames.length} games matching your criteria
            </Text>
            <Button size="sm" variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </Flex>
        </Box>

        {/* Recommended Games */}
        {recommendedGames.length > 0 && (
          <Box>
            <Text fontSize="lg" fontWeight="semibold" mb={4} color="gray.700">
              🎯 Recommended Games for Your Group
            </Text>
            <Box
              display="grid"
              gridTemplateColumns="repeat(auto-fill, minmax(280px, 1fr))"
              gap={4}
            >
              {recommendedGames.map(game => (
                <Box
                  key={game.objectid}
                  p={4}
                  bg="white"
                  borderRadius="lg"
                  border="1px solid"
                  borderColor="gray.200"
                  boxShadow="sm"
                >
                  <Text fontWeight="bold" fontSize="lg" mb={2} color="gray.800">
                    {game.name?.text || "Unknown Game"}
                  </Text>
                  <Text fontSize="sm" color="gray.600" mb={3}>
                    Players: {game.stats?.minplayers}-{game.stats?.maxplayers} |
                    Time: {game.stats?.playingtime}min | Rating:{" "}
                    {game.stats?.rating?.average?.value?.toFixed(1) || "N/A"}
                  </Text>
                  {game.thumbnail && (
                    <Box mb={3}>
                      <img
                        src={game.thumbnail}
                        alt={game.name?.text || "Game"}
                        style={{
                          width: "100%",
                          height: "120px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* No Games Found */}
        {filteredGames.length === 0 && (
          <Box textAlign="center" py={8}>
            <Icon as={FaGamepad} boxSize={12} color="gray.400" mb={4} />
            <Text fontSize="lg" color="gray.600" mb={2}>
              No games found matching your criteria
            </Text>
            <Text color="gray.500" fontSize="sm">
              Try adjusting your filters to find more games
            </Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default GameNightPlanner;
