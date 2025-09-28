import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Icon,
  Button,
  useMediaQuery,
} from "@chakra-ui/react";
import React, { useState } from "react";
import {
  FaStar,
  FaUsers,
  FaClock,
  FaGamepad,
  FaCopy,
  FaTwitter,
  FaDiscord,
  FaTelegram,
  FaWhatsapp,
} from "react-icons/fa";
import { BggCollectionItem } from "../utils/types";

interface GameNFTCollectionProps {
  games: BggCollectionItem[];
  sessionDuration: string;
  sortMethod: string;
}

const GameNFTCollection: React.FC<GameNFTCollectionProps> = ({
  games,
  sessionDuration,
  sortMethod,
}) => {
  const [_isSharing, setIsSharing] = useState(false);
  const [isMobile] = useMediaQuery(["(max-width: 768px)"]);

  if (games.length === 0) return null;

  const generateCoolInvite = () => {
    const rarityCounts = games.reduce(
      (acc, game) => {
        const rating = game.stats?.rating?.average?.value || 0;
        if (rating >= 8.5) acc.legendary++;
        else if (rating >= 8.0) acc.epic++;
        else if (rating >= 7.5) acc.rare++;
        else if (rating >= 7.0) acc.uncommon++;
        else acc.common++;
        return acc;
      },
      { legendary: 0, epic: 0, rare: 0, uncommon: 0, common: 0 }
    );

    const invite = `🎮🎲 GAME NIGHT NFT COLLECTION 🎲🎮

🔥 COLLECTION STATS:
• ${games.length} UNIQUE DIGITAL COLLECTIBLES
• Session Duration: ${sessionDuration.toUpperCase()}
• Sort Method: ${sortMethod === "random" ? "MYSTERY" : sortMethod === "rating" ? "LEGENDARY" : "OPTIMIZED"}

💎 RARITY BREAKDOWN:
${rarityCounts.legendary > 0 ? `• ${rarityCounts.legendary} LEGENDARY (8.5+)` : ""}
${rarityCounts.epic > 0 ? `• ${rarityCounts.epic} EPIC (8.0+)` : ""}
${rarityCounts.rare > 0 ? `• ${rarityCounts.rare} RARE (7.5+)` : ""}
${rarityCounts.uncommon > 0 ? `• ${rarityCounts.uncommon} UNCOMMON (7.0+)` : ""}
${rarityCounts.common > 0 ? `• ${rarityCounts.common} COMMON (<7.0)` : ""}

🎯 GAME COLLECTION:
${games
  .map((game, index) => {
    const rating = game.stats?.rating?.average?.value || 0;
    const players = `${game.stats?.minplayers || 0}-${game.stats?.maxplayers || 0}`;
    const time = `${game.stats?.playingtime || 0}m`;
    return `${index + 1}. ${game.name?.text || "Unknown Game"} (${rating.toFixed(1)}⭐ ${players}👥 ${time}⏱️)`;
  })
  .join("\n")}`;
    return invite;
  };

  const handleShare = async (platform?: string) => {
    setIsSharing(true);
    const invite = generateCoolInvite();
    const shortInvite = `🎮🎲 GAME NIGHT NFT COLLECTION 🎲🎮\n\n${games.length} UNIQUE DIGITAL COLLECTIBLES\nSession: ${sessionDuration}\n\n${games.map(game => `• ${game.name?.text || "Unknown Game"}`).join("\n")}`;

    try {
      if (platform === "twitter") {
        const tweetText = encodeURIComponent(shortInvite);
        window.open(
          `https://twitter.com/intent/tweet?text=${tweetText}`,
          "_blank"
        );
      } else if (platform === "discord") {
        await navigator.clipboard.writeText(invite);
        alert("Discord invite copied to clipboard! 🎮");
      } else if (platform === "telegram") {
        const telegramText = encodeURIComponent(shortInvite);
        window.open(
          `https://t.me/share/url?url=&text=${telegramText}`,
          "_blank"
        );
      } else if (platform === "whatsapp") {
        const whatsappText = encodeURIComponent(shortInvite);
        window.open(`https://wa.me/?text=${whatsappText}`, "_blank");
      } else if (isMobile && navigator.share) {
        // Mobile: Use native sharing
        await navigator.share({
          title: "🎮 Game Night NFT Collection",
          text: invite,
        });
      } else {
        // Desktop or fallback: Copy to clipboard
        await navigator.clipboard.writeText(invite);
        alert("NFT Collection copied to clipboard! 🎮");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Box
      bg="linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)"
      borderRadius="2xl"
      p={8}
      mb={6}
      position="relative"
      overflow="hidden"
    >
      {/* Header */}
      <VStack spacing={4} position="relative" zIndex={2}>
        <VStack spacing={2}>
          <Text
            fontSize="3xl"
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
            fontSize="lg"
            color="pink.400"
            textAlign="center"
            textShadow="0 0 5px #ff00ff"
            fontFamily="mono"
            letterSpacing="1px"
          >
            {games.length} UNIQUE DIGITAL COLLECTIBLES
          </Text>
          <Text
            fontSize="md"
            color="gray.300"
            textAlign="center"
            fontFamily="mono"
            letterSpacing="1px"
          >
            Session: {sessionDuration} •{" "}
            {sortMethod === "random"
              ? "Randomized"
              : sortMethod === "rating"
                ? "Top Rated"
                : "Time Optimized"}
          </Text>
        </VStack>

        {/* Game NFT Cards Grid */}
        <Box
          display="grid"
          gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))"
          gap={4}
          w="100%"
          mt={6}
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

        {/* Share Buttons */}
        <Box mt={4}>
          {isMobile ? (
            /* Mobile: Single share button */
            <Button
              onClick={() => handleShare()}
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
                boxShadow:
                  "0 0 20px rgba(255, 0, 255, 0.5), 0 0 40px rgba(0, 255, 255, 0.5)",
              }}
              _active={{
                transform: "scale(0.95)",
              }}
              transition="all 0.2s"
              textShadow="0 0 5px rgba(0, 0, 0, 0.8)"
              fontFamily="mono"
              letterSpacing="1px"
            >
              <Icon as={FaCopy} mr={2} />
              SHARE NFT COLLECTION
            </Button>
          ) : (
            /* Desktop: Social media buttons */
            <VStack spacing={3}>
              <Button
                onClick={() => handleShare("twitter")}
                bg="linear-gradient(45deg, #1DA1F2, #00ffff)"
                color="white"
                fontWeight="bold"
                fontSize="md"
                px={6}
                py={3}
                borderRadius="full"
                border="2px solid"
                borderColor="#1DA1F2"
                _hover={{
                  transform: "scale(1.05)",
                  boxShadow: "0 0 20px rgba(29, 161, 242, 0.5)",
                }}
                transition="all 0.2s"
                fontFamily="mono"
                letterSpacing="1px"
              >
                <Icon as={FaTwitter} mr={2} />
                Share on Twitter
              </Button>

              <HStack spacing={3}>
                <Button
                  onClick={() => handleShare("discord")}
                  bg="linear-gradient(45deg, #5865F2, #00ffff)"
                  color="white"
                  fontWeight="bold"
                  fontSize="sm"
                  px={4}
                  py={2}
                  borderRadius="full"
                  border="2px solid"
                  borderColor="#5865F2"
                  _hover={{
                    transform: "scale(1.05)",
                    boxShadow: "0 0 15px rgba(88, 101, 242, 0.5)",
                  }}
                  transition="all 0.2s"
                  fontFamily="mono"
                >
                  <Icon as={FaDiscord} mr={2} />
                  Discord
                </Button>

                <Button
                  onClick={() => handleShare("telegram")}
                  bg="linear-gradient(45deg, #0088cc, #00ffff)"
                  color="white"
                  fontWeight="bold"
                  fontSize="sm"
                  px={4}
                  py={2}
                  borderRadius="full"
                  border="2px solid"
                  borderColor="#0088cc"
                  _hover={{
                    transform: "scale(1.05)",
                    boxShadow: "0 0 15px rgba(0, 136, 204, 0.5)",
                  }}
                  transition="all 0.2s"
                  fontFamily="mono"
                >
                  <Icon as={FaTelegram} mr={2} />
                  Telegram
                </Button>

                <Button
                  onClick={() => handleShare("whatsapp")}
                  bg="linear-gradient(45deg, #25D366, #00ffff)"
                  color="white"
                  fontWeight="bold"
                  fontSize="sm"
                  px={4}
                  py={2}
                  borderRadius="full"
                  border="2px solid"
                  borderColor="#25D366"
                  _hover={{
                    transform: "scale(1.05)",
                    boxShadow: "0 0 15px rgba(37, 211, 102, 0.5)",
                  }}
                  transition="all 0.2s"
                  fontFamily="mono"
                >
                  <Icon as={FaWhatsapp} mr={2} />
                  WhatsApp
                </Button>
              </HStack>

              <Button
                onClick={() => handleShare()}
                bg="linear-gradient(45deg, #ff00ff, #00ffff)"
                color="black"
                fontWeight="bold"
                fontSize="md"
                px={6}
                py={3}
                borderRadius="full"
                border="2px solid"
                borderColor="white"
                _hover={{
                  transform: "scale(1.05)",
                  boxShadow:
                    "0 0 20px rgba(255, 0, 255, 0.5), 0 0 40px rgba(0, 255, 255, 0.5)",
                }}
                transition="all 0.2s"
                fontFamily="mono"
                letterSpacing="1px"
              >
                <Icon as={FaCopy} mr={2} />
                Copy to Clipboard
              </Button>
            </VStack>
          )}
        </Box>
      </VStack>
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

export default GameNFTCollection;
