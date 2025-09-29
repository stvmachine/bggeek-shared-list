import { Box, Flex, Text, VStack, HStack, Icon, Button, Spinner } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaStar, FaUsers, FaClock, FaGamepad } from "react-icons/fa";
import { BggCollectionItem } from "../../utils/types";

interface SharePageProps {
  collectionId: string;
}

interface CollectionData {
  games: BggCollectionItem[];
  sessionDuration: string;
  sortMethod: string;
  filters: any;
  metadata: {
    createdAt: string;
    views: number;
  };
}

const SharePage: React.FC<SharePageProps> = ({ collectionId }) => {
  const router = useRouter();
  const [collectionData, setCollectionData] = useState<CollectionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load collection metadata and fetch fresh game data
    const fetchCollection = async () => {
      try {
        // First, get collection metadata
        const metadataResponse = await fetch(`/api/collections/${collectionId}`);
        if (!metadataResponse.ok) {
          throw new Error('Collection not found');
        }
        
        const metadataData = await metadataResponse.json();
        if (!metadataData.success) {
          throw new Error('Failed to load collection');
        }

        // Then, get fresh game data
        const gamesResponse = await fetch(`/api/collections/${collectionId}/games`);
        if (!gamesResponse.ok) {
          throw new Error('Failed to load games');
        }
        
        const gamesData = await gamesResponse.json();
        if (!gamesData.success) {
          throw new Error('Failed to load games');
        }

        // For now, we'll need to fetch the actual game data from BGG
        // This is where you'd implement the BGG data fetching
        // For demo purposes, we'll create mock data
        const mockGames: BggCollectionItem[] = gamesData.gameIds.map((id: string, index: number) => ({
          objectid: id,
          name: { text: `Game ${index + 1}` },
          thumbnail: null,
          stats: {
            rating: { average: { value: 7.5 + Math.random() } },
            minplayers: 2,
            maxplayers: 4,
            playingtime: 60,
          },
        }));

        setCollectionData({
          games: mockGames,
          sessionDuration: gamesData.sessionDuration,
          sortMethod: gamesData.sortMethod,
          filters: gamesData.filters,
          metadata: gamesData.metadata,
        });

      } catch (error) {
        console.error('Error fetching collection:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, [collectionId]);

  if (loading) {
    return (
      <Box minH="100vh" bg="gray.900" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Spinner size="xl" color="cyan.400" />
          <Text color="white">Loading collection...</Text>
        </VStack>
      </Box>
    );
  }

  if (!collectionData || collectionData.games.length === 0) {
    return (
      <Box minH="100vh" bg="gray.900" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Text fontSize="2xl" color="white">Collection not found</Text>
          <Button onClick={() => router.push('/game-night')}>
            Go to Game Night Planner
          </Button>
        </VStack>
      </Box>
    );
  }

  const { games, sessionDuration, sortMethod } = collectionData;

  return (
    <Box minH="100vh" bg="gray.900" py={8}>
      <Box maxW="1200px" mx="auto" px={4}>
        {/* Header */}
        <VStack spacing={4} mb={8}>
          <Text
            fontSize="4xl"
            fontWeight="bold"
            color="cyan.400"
            textAlign="center"
            textShadow="0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff"
            fontFamily="mono"
            letterSpacing="2px"
          >
            🎮 GAME NIGHT NFT COLLECTION 🎮
          </Text>
          <Text
            fontSize="xl"
            color="pink.400"
            textAlign="center"
            textShadow="0 0 5px #ff00ff"
            fontFamily="mono"
            letterSpacing="1px"
          >
            {games.length} UNIQUE DIGITAL COLLECTIBLES
          </Text>
          <Text
            fontSize="lg"
            color="gray.300"
            textAlign="center"
            fontFamily="mono"
            letterSpacing="1px"
          >
            Session: {sessionDuration} • {sortMethod === "random" ? "Randomized" : sortMethod === "rating" ? "Top Rated" : "Time Optimized"}
          </Text>
        </VStack>

        {/* NFT Collection Container */}
        <Box
          bg="linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)"
          borderRadius="2xl"
          p={8}
          mb={6}
          position="relative"
          overflow="hidden"
        >
          {/* Game NFT Cards Grid */}
          <Box
            display="grid"
            gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))"
            gap={4}
            w="100%"
          >
            {games.map((game, index) => (
              <GameNFTCard
                key={game.objectid}
                game={game}
                index={index + 1}
                total={games.length}
              />
            ))}
          </Box>

          {/* Collection Stats */}
          <Box
            mt={6}
            p={4}
            bg="rgba(0, 0, 0, 0.5)"
            borderRadius="lg"
            border="1px solid"
            borderColor="cyan.300"
            w="100%"
          >
            <HStack justify="space-around" wrap="wrap" spacing={4}>
              <VStack spacing={1}>
                <Icon as={FaGamepad} color="#00ffff" boxSize="20px" />
                <Text fontSize="sm" color="cyan.300" fontFamily="mono">
                  COLLECTION SIZE
                </Text>
                <Text fontSize="lg" color="white" fontWeight="bold">
                  {games.length} GAMES
                </Text>
              </VStack>
              
              <VStack spacing={1}>
                <Icon as={FaClock} color="#ff00ff" boxSize="20px" />
                <Text fontSize="sm" color="pink.300" fontFamily="mono">
                  SESSION TIME
                </Text>
                <Text fontSize="lg" color="white" fontWeight="bold">
                  {sessionDuration.toUpperCase()}
                </Text>
              </VStack>
              
              <VStack spacing={1}>
                <Icon as={FaStar} color="#00ff00" boxSize="20px" />
                <Text fontSize="sm" color="green.300" fontFamily="mono">
                  RARITY
                </Text>
                <Text fontSize="lg" color="white" fontWeight="bold">
                  {sortMethod === "rating"
                    ? "LEGENDARY"
                    : sortMethod === "random"
                      ? "MYSTERY"
                      : "OPTIMIZED"}
                </Text>
              </VStack>
            </HStack>
          </Box>
        </Box>

        {/* Action Buttons */}
        <VStack spacing={4}>
          <Button
            onClick={() => router.push('/game-night')}
            bg="linear-gradient(45deg, #ff00ff, #00ffff)"
            color="black"
            fontWeight="bold"
            fontSize="lg"
            px={8}
            py={4}
            borderRadius="full"
            border="2px solid"
            borderColor="white"
            _hover={{
              transform: "scale(1.05)",
              boxShadow: "0 0 20px rgba(255, 0, 255, 0.5), 0 0 40px rgba(0, 255, 255, 0.5)",
            }}
            transition="all 0.2s"
            fontFamily="mono"
            letterSpacing="1px"
          >
            🎲 Create Your Own Collection
          </Button>
          
          <Text fontSize="sm" color="gray.400" textAlign="center">
            Collection ID: {collectionId}
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};

interface GameNFTCardProps {
  game: BggCollectionItem;
  index: number;
  total: number;
}

const GameNFTCard: React.FC<GameNFTCardProps> = ({ game }) => {
  const rating = game.stats?.rating?.average?.value || 0;
  const playingTime = game.stats?.playingtime || 0;
  const minPlayers = game.stats?.minplayers || 0;
  const maxPlayers = game.stats?.maxplayers || 0;

  // Determine rarity based on rating
  const getRarity = (rating: number) => {
    if (rating >= 8.5)
      return { name: "LEGENDARY", color: "#ff6b35", glow: "#ff6b35" };
    if (rating >= 8.0)
      return { name: "EPIC", color: "#9d4edd", glow: "#9d4edd" };
    if (rating >= 7.5)
      return { name: "RARE", color: "#00b4d8", glow: "#00b4d8" };
    if (rating >= 7.0)
      return { name: "UNCOMMON", color: "#06ffa5", glow: "#06ffa5" };
    return { name: "COMMON", color: "#adb5bd", glow: "#adb5bd" };
  };

  const rarity = getRarity(rating);

  return (
    <Box
      position="relative"
      bg="linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)"
      borderRadius="lg"
      p={3}
      border="2px solid"
      borderColor={rarity.color}
      boxShadow={`0 0 15px ${rarity.glow}40, inset 0 0 15px ${rarity.glow}20`}
      overflow="hidden"
      _hover={{
        transform: "scale(1.02)",
        boxShadow: `0 0 25px ${rarity.glow}60, inset 0 0 25px ${rarity.glow}30`,
      }}
      transition="all 0.3s ease"
    >
      {/* Game Image */}
      <Box
        w="100%"
        h="80px"
        bg="gray.800"
        borderRadius="md"
        mb={2}
        overflow="hidden"
        position="relative"
        border="1px solid"
        borderColor="gray.600"
      >
        {game.thumbnail ? (
          <img
            src={game.thumbnail}
            alt={game.name?.text}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <Flex
            w="100%"
            h="100%"
            align="center"
            justify="center"
            color="gray.400"
          >
            <Icon as={FaGamepad} boxSize="32px" />
          </Flex>
        )}
      </Box>

      {/* Game Info */}
      <VStack spacing={1} align="stretch">
        <Text
          fontSize="xs"
          fontWeight="bold"
          color="white"
          noOfLines={2}
          textAlign="center"
          fontFamily="mono"
        >
          {game.name?.text || "Unknown Game"}
        </Text>

        {/* Stats */}
        <HStack justify="space-between" fontSize="2xs" color="gray.300">
          <HStack spacing={0.5}>
            <Icon as={FaStar} color={rarity.color} boxSize="10px" />
            <Text fontFamily="mono">{rating.toFixed(1)}</Text>
          </HStack>
          
          <HStack spacing={0.5}>
            <Icon as={FaUsers} color="cyan.400" boxSize="10px" />
            <Text fontFamily="mono">
              {minPlayers}-{maxPlayers}
            </Text>
          </HStack>
          
          <HStack spacing={0.5}>
            <Icon as={FaClock} color="pink.400" boxSize="10px" />
            <Text fontFamily="mono">{playingTime}m</Text>
          </HStack>
        </HStack>
      </VStack>
    </Box>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { id } = params as { id: string };
  
  // In a real app, you'd fetch from a database
  // For now, we'll return empty props and let the client handle loading
  return {
    props: {
      collectionId: id,
    },
  };
};

export default SharePage;
