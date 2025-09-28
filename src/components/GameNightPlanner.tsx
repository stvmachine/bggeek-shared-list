import { Box, Button, Flex, Icon, Text, VStack, Wrap } from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import { FaClock, FaUsers, FaStar, FaGamepad } from "react-icons/fa";
import { BggCollectionItem } from "../utils/types";
import GameCard from "./GameCard";
import GameNFTCollection from "./GameNFTCollection";

interface GameNightPlannerProps {
  games: BggCollectionItem[];
}

type GroupSize = "2-4" | "5-6" | "7+";
type PlayTime = "30-60min" | "1-2hrs" | "2+hrs";
type Quality = "any" | "good" | "excellent";
type GameType = "strategy" | "party" | "cooperative" | "competitive" | "all";
type SessionDuration = "2hrs" | "3hrs" | "4hrs" | "5hrs" | "6hrs" | "8hrs";
type NumberOfGames = "3" | "5" | "6" | "8" | "10" | "12";
type SortMethod = "rating" | "random" | "time";

const GameNightPlanner: React.FC<GameNightPlannerProps> = ({ games }) => {
  const [groupSize, setGroupSize] = useState<GroupSize>("2-4");
  const [playTime, setPlayTime] = useState<PlayTime>("30-60min");
  const [quality, setQuality] = useState<Quality>("any");
  const [gameType, setGameType] = useState<GameType>("all");
  const [sessionDuration, setSessionDuration] =
    useState<SessionDuration>("3hrs");
  const [numberOfGames, setNumberOfGames] = useState<NumberOfGames>("6");
  const [sortMethod, setSortMethod] = useState<SortMethod>("rating");

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

      // Quality filter (based on BGG rating)
      const rating = game.stats?.rating?.average?.value || 0;

      if (quality === "good" && rating < 7.0) {
        return false;
      }
      if (quality === "excellent" && rating < 8.0) {
        return false;
      }

      return true;
    });
  }, [games, groupSize, playTime, quality, gameType]);

  // Get recommended games based on user preferences
  const recommendedGames = useMemo(() => {
    let sortedGames = [...filteredGames];

    // Sort based on user preference
    if (sortMethod === "rating") {
      sortedGames.sort((a, b) => {
        const ratingA = a.stats?.rating?.average?.value || 0;
        const ratingB = b.stats?.rating?.average?.value || 0;
        return ratingB - ratingA;
      });
    } else if (sortMethod === "time") {
      sortedGames.sort((a, b) => {
        const timeA = a.stats?.playingtime || 0;
        const timeB = b.stats?.playingtime || 0;
        return timeA - timeB; // Shorter games first
      });
    } else if (sortMethod === "random") {
      // Shuffle the array
      sortedGames.sort(() => Math.random() - 0.5);
    }

    // Take the requested number of games
    const gameCount = parseInt(numberOfGames);
    return sortedGames.slice(0, gameCount);
  }, [filteredGames, sortMethod, numberOfGames]);

  const clearFilters = () => {
    setGroupSize("2-4");
    setPlayTime("30-60min");
    setQuality("any");
    setGameType("all");
    setSessionDuration("3hrs");
    setNumberOfGames("6");
    setSortMethod("rating");
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

            {/* Rating */}
            <Box minW="200px">
              <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.600">
                <Icon as={FaStar} mr={2} />
                Rating
              </Text>
              <select
                value={quality}
                onChange={e => setQuality(e.target.value as Quality)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  fontSize: "14px",
                  backgroundColor: "white",
                }}
              >
                <option value="any">Any Rating</option>
                <option value="good">Good (7.0+)</option>
                <option value="excellent">Excellent (8.0+)</option>
              </select>
            </Box>
          </Wrap>

          {/* Session Planning Controls */}
          <Box
            mt={6}
            p={4}
            bg="blue.50"
            borderRadius="lg"
            border="1px solid"
            borderColor="blue.200"
          >
            <Text fontSize="md" fontWeight="semibold" mb={4} color="blue.700">
              🎯 Session Planning
            </Text>

            <Wrap spacing={4}>
              {/* Session Duration */}
              <Box minW="200px">
                <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.600">
                  <Icon as={FaClock} mr={2} />
                  Session Duration
                </Text>
                <select
                  value={sessionDuration}
                  onChange={e =>
                    setSessionDuration(e.target.value as SessionDuration)
                  }
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    fontSize: "14px",
                    backgroundColor: "white",
                  }}
                >
                  <option value="2hrs">2 hours</option>
                  <option value="3hrs">3 hours</option>
                  <option value="4hrs">4 hours</option>
                  <option value="5hrs">5 hours</option>
                  <option value="6hrs">6 hours</option>
                  <option value="8hrs">8 hours</option>
                </select>
              </Box>

              {/* Number of Games */}
              <Box minW="200px">
                <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.600">
                  <Icon as={FaGamepad} mr={2} />
                  Number of Games
                </Text>
                <select
                  value={numberOfGames}
                  onChange={e =>
                    setNumberOfGames(e.target.value as NumberOfGames)
                  }
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    fontSize: "14px",
                    backgroundColor: "white",
                  }}
                >
                  <option value="3">3 games</option>
                  <option value="5">5 games</option>
                  <option value="6">6 games</option>
                  <option value="8">8 games</option>
                  <option value="10">10 games</option>
                  <option value="12">12 games</option>
                </select>
              </Box>

              {/* Sort Method */}
              <Box minW="200px">
                <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.600">
                  <Icon as={FaStar} mr={2} />
                  Sort By
                </Text>
                <select
                  value={sortMethod}
                  onChange={e => setSortMethod(e.target.value as SortMethod)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    fontSize: "14px",
                    backgroundColor: "white",
                  }}
                >
                  <option value="rating">Highest Rated</option>
                  <option value="time">Shortest Time</option>
                  <option value="random">Random</option>
                </select>
              </Box>
            </Wrap>
          </Box>

          <Flex justify="space-between" align="center">
            <Text fontSize="sm" color="gray.500">
              Found {filteredGames.length} games matching your criteria
            </Text>
            <Button size="sm" variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </Flex>
        </Box>

        {/* Game NFT Collection */}
        {recommendedGames.length > 0 && (
          <GameNFTCollection
            games={recommendedGames}
            sessionDuration={sessionDuration}
            sortMethod={sortMethod}
          />
        )}

        {/* Recommended Games */}
        {recommendedGames.length > 0 && (
          <Box>
            <Text fontSize="lg" fontWeight="semibold" mb={2} color="gray.700">
              🎯 Recommended Games for Your Group
            </Text>
            <Text fontSize="sm" color="gray.600" mb={4}>
              Showing {recommendedGames.length} games for your {sessionDuration}{" "}
              session
              {sortMethod === "random" && " (randomized)"}
              {sortMethod === "rating" && " (highest rated first)"}
              {sortMethod === "time" && " (shortest games first)"}
            </Text>
            <Box
              display="grid"
              gridTemplateColumns="repeat(auto-fill, minmax(280px, 1fr))"
              gap={4}
            >
              {recommendedGames.map(game => (
                <GameCard
                  key={game.objectid}
                  id={game.objectid}
                  name={game.name?.text || "Unknown Game"}
                  thumbnail={game.thumbnail}
                  yearPublished={game.yearpublished?.toString()}
                  minPlayers={game.stats?.minplayers}
                  maxPlayers={game.stats?.maxplayers}
                  playingTime={game.stats?.playingtime}
                  averageRating={game.stats?.rating?.average?.value}
                  owners={game.owners || []}
                />
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
