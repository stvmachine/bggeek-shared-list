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
import React, { useState, useEffect, useRef } from "react";
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
  FaDice,
  FaMagic,
} from "react-icons/fa";
import { BggCollectionItem } from "../utils/types";

interface GameNFTCollectionProps {
  games: BggCollectionItem[];
  sessionDuration: string;
  sortMethod: string;
  fullCollection?: BggCollectionItem[]; // Full collection for randomization
}

// Animation keyframes
const spin = `
  0% { transform: rotateY(0deg) scale(1); }
  50% { transform: rotateY(180deg) scale(1.1); }
  100% { transform: rotateY(360deg) scale(1); }
`;

const pulse = `
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
`;

const holographicGlow = `
  0%, 100% { 
    box-shadow: 0 0 20px #00ffff, 0 0 40px #ff00ff, 0 0 60px #00ffff;
    transform: translateZ(0);
  }
  50% { 
    box-shadow: 0 0 30px #ff00ff, 0 0 60px #00ffff, 0 0 90px #ff00ff;
    transform: translateZ(10px);
  }
`;

const popupAnimation = `
  0% { 
    transform: scale(0) rotateY(0deg);
    opacity: 0;
  }
  50% { 
    transform: scale(1.2) rotateY(180deg);
    opacity: 0.8;
  }
  100% { 
    transform: scale(1) rotateY(360deg);
    opacity: 1;
  }
`;

const shimmer = `
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const GameNFTCollection: React.FC<GameNFTCollectionProps> = ({
  games,
  sessionDuration,
  sortMethod,
  fullCollection,
}) => {
  const [_isSharing, setIsSharing] = useState(false);
  const [isMobile] = useMediaQuery(["(max-width: 768px)"]);
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [selectedGames, setSelectedGames] = useState<BggCollectionItem[]>([]);
  const [displayedGames, setDisplayedGames] = useState<BggCollectionItem[]>(games);
  const [showPopup, setShowPopup] = useState(false);
  const [randomizeCount, setRandomizeCount] = useState(0);
  const [pickCount, setPickCount] = useState(5); // Default to picking 5 games
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (games.length === 0) return null;

  // Function to determine grid columns based on number of games
  const getGridColumns = (gameCount: number) => {
    // Mobile responsive behavior
    if (isMobile) {
      if (gameCount <= 2) return "repeat(2, 1fr)";
      if (gameCount <= 4) return "repeat(2, 1fr)";
      if (gameCount <= 6) return "repeat(3, 1fr)";
      return "repeat(auto-fit, minmax(180px, 1fr))";
    }
    
    // Desktop behavior
    if (gameCount <= 3) return "repeat(3, 1fr)"; // 1 row for 3 games
    if (gameCount <= 5) return "repeat(5, 1fr)"; // 1 row for 5 games
    if (gameCount <= 7) return "repeat(4, 1fr)"; // 2 rows for 7 games (4+3)
    if (gameCount <= 10) return "repeat(5, 1fr)"; // 2 rows for 10 games (5+5)
    return "repeat(auto-fit, minmax(250px, 1fr))"; // Fallback for more games
  };

  // Initialize displayed games
  useEffect(() => {
    setDisplayedGames(games);
  }, [games]);

  // Create audio context for sound effects
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Create a simple beep sound using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioRef.current = {
        play: () => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
          
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.3);
        }
      } as HTMLAudioElement;
    }
  }, []);

  const handleRandomPick = async () => {
    if (isRandomizing) return;
    
    setIsRandomizing(true);
    setShowPopup(false);
    setSelectedGames([]);
    setRandomizeCount(0);

    // Use full collection if available, otherwise fall back to games
    const collectionToUse = fullCollection || games;

    // Play randomization sound
    if (audioRef.current) {
      audioRef.current.play();
    }

    // Animate through different random selections from the ENTIRE collection
    const animationDuration = 2000; // 2 seconds
    const intervalTime = 100; // Change every 100ms
    const totalSteps = animationDuration / intervalTime;
    
    for (let i = 0; i < totalSteps; i++) {
      // Pick X random games from the entire collection
      const shuffledGames = [...collectionToUse].sort(() => Math.random() - 0.5);
      const randomSelection = shuffledGames.slice(0, pickCount);
      
      // Show the randomly selected games
      setDisplayedGames(randomSelection);
      setRandomizeCount(i + 1);
      
      await new Promise(resolve => setTimeout(resolve, intervalTime));
    }

    // Final selection - pick X final random games from the entire collection
    const shuffledGames = [...collectionToUse].sort(() => Math.random() - 0.5);
    const finalSelection = shuffledGames.slice(0, pickCount);
    setSelectedGames(finalSelection);
    
    // Show the selected games prominently
    setDisplayedGames(finalSelection);
    
    // Show popup animation
    setTimeout(() => {
      setShowPopup(true);
      // Play success sound
      if (audioRef.current) {
        audioRef.current.play();
      }
    }, 500);

    setIsRandomizing(false);
  };

  const generateShareableLink = async () => {
    try {
      const response = await fetch('/api/collections/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usernames: [], // TODO: Get usernames from context/props
          sessionDuration,
          numberOfGames: games.length.toString(),
          sortMethod,
          filters: {
            // Store the original filters that were used to generate this collection
            groupSize: games.length > 0 ? games[0].stats?.minplayers : 0,
            // Add other relevant filters here
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create collection');
      }

      const data = await response.json();
      return data.shareUrl;
    } catch (error) {
      console.error('Error creating shareable link:', error);
      throw error;
    }
  };

  const handleShare = async (platform?: string) => {
    setIsSharing(true);
    
    try {
      // Generate shareable link
      const shareUrl = await generateShareableLink();
      const caption = `🎮🎲 GAME NIGHT NFT COLLECTION 🎲🎮\n\n${games.length} UNIQUE DIGITAL COLLECTIBLES\nSession: ${sessionDuration}\n\nCheck out my collection: ${shareUrl}\n\n#GameNight #BoardGames #NFT #BGG`;
      
      if (platform === "twitter") {
        const tweetText = encodeURIComponent(caption);
        window.open(
          `https://twitter.com/intent/tweet?text=${tweetText}`,
          "_blank"
        );
      } else if (platform === "discord") {
        await navigator.clipboard.writeText(caption);
        alert("Discord invite copied to clipboard! 🎮");
      } else if (platform === "telegram") {
        const telegramText = encodeURIComponent(caption);
        window.open(
          `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${telegramText}`,
          "_blank"
        );
      } else if (platform === "whatsapp") {
        const whatsappText = encodeURIComponent(caption);
        window.open(`https://wa.me/?text=${whatsappText}`, "_blank");
      } else if (isMobile && navigator.share) {
        // Mobile: Use native sharing
        await navigator.share({
          title: "🎮 Game Night NFT Collection",
          text: caption,
          url: shareUrl,
        });
      } else {
        // Desktop fallback: Copy to clipboard
        await navigator.clipboard.writeText(caption);
        alert("NFT Collection link copied to clipboard! 🎮");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <>
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes spin {
          ${spin}
        }
        @keyframes pulse {
          ${pulse}
        }
        @keyframes holographicGlow {
          ${holographicGlow}
        }
        @keyframes popupAnimation {
          ${popupAnimation}
        }
        @keyframes shimmer {
          ${shimmer}
        }
      `}</style>
      
      <Box
        data-nft-collection
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

        {/* Random Pick Button */}
        <Box mt={4}>
          <VStack spacing={3}>
            <Text
              fontSize="sm"
              color="cyan.300"
              textAlign="center"
              fontFamily="mono"
              letterSpacing="1px"
            >
              PICKING {pickCount} GAMES FROM {(fullCollection || games).length} TOTAL
            </Text>
            
            {/* Pick Count Selector */}
            <HStack spacing={2} wrap="wrap" justify="center">
              {[3, 5, 7, 10].map((count) => (
                <Button
                  key={count}
                  size="sm"
                  variant={pickCount === count ? "solid" : "outline"}
                  colorScheme={pickCount === count ? "cyan" : "gray"}
                  onClick={() => setPickCount(count)}
                  disabled={isRandomizing}
                  fontFamily="mono"
                  fontSize="xs"
                >
                  {count}
                </Button>
              ))}
            </HStack>
            
            <Button
            onClick={handleRandomPick}
            disabled={isRandomizing}
            bg="linear-gradient(45deg, #ff00ff, #00ffff, #ff00ff)"
            bgSize="200% 200%"
            color="black"
            fontWeight="bold"
            fontSize="lg"
            px={8}
            py={4}
            borderRadius="full"
            border="3px solid"
            borderColor="white"
            _hover={{
              transform: "scale(1.05)",
              boxShadow: "0 0 30px rgba(255, 0, 255, 0.8), 0 0 60px rgba(0, 255, 255, 0.8)",
              animation: `${holographicGlow} 2s ease-in-out infinite`,
            }}
            _active={{
              transform: "scale(0.95)",
            }}
            _disabled={{
              opacity: 0.6,
              cursor: "not-allowed",
            }}
            transition="all 0.3s"
            textShadow="0 0 5px rgba(0, 0, 0, 0.8)"
            fontFamily="mono"
            letterSpacing="1px"
            animation={isRandomizing ? `spin 0.5s linear infinite` : "none"}
            position="relative"
            overflow="hidden"
            _before={{
              content: '""',
              position: "absolute",
              top: 0,
              left: "-100%",
              width: "100%",
              height: "100%",
              background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)",
              animation: isRandomizing ? "shimmer 1.5s infinite" : "none",
            }}
          >
            <Icon as={isRandomizing ? FaMagic : FaDice} mr={2} />
            {isRandomizing ? `RANDOMIZING... ${randomizeCount}/20` : `🎲 PICK ${pickCount} RANDOM GAMES 🎲`}
          </Button>
          </VStack>
        </Box>

        {/* Game NFT Cards Grid */}
        <Box
          display="grid"
          gridTemplateColumns={getGridColumns(displayedGames.length)}
          gap={4}
          w="100%"
          mt={6}
        >
          {displayedGames.map((game, index) => (
            <GameNFTCard
              key={game.objectid}
              game={game}
              index={index + 1}
              total={displayedGames.length}
              isSelected={selectedGames.some(selected => selected.objectid === game.objectid)}
              showPopup={showPopup && selectedGames.some(selected => selected.objectid === game.objectid)}
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
                {selectedGames.length > 0 ? "SELECTED GAMES" : "COLLECTION SIZE"}
              </Text>
              <Text fontSize="lg" color="white" fontWeight="bold">
                {selectedGames.length > 0 ? `${selectedGames.length} PICKED` : `${games.length} TOTAL`}
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
    </>
  );
};

interface GameNFTCardProps {
  game: BggCollectionItem;
  index: number;
  total: number;
  isSelected?: boolean;
  showPopup?: boolean;
}

const GameNFTCard: React.FC<GameNFTCardProps> = ({ game, isSelected = false, showPopup = false }) => {
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
      bg={isSelected 
        ? "linear-gradient(135deg, #ff00ff 0%, #00ffff 50%, #ff00ff 100%)"
        : "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)"
      }
      borderRadius="lg"
      p={3}
      border={isSelected ? "3px solid" : "2px solid"}
      borderColor={isSelected ? "#ffffff" : rarity.color}
      boxShadow={isSelected 
        ? "0 0 30px #ff00ff, 0 0 60px #00ffff, 0 0 90px #ff00ff, inset 0 0 30px rgba(255, 255, 255, 0.3)"
        : `0 0 15px ${rarity.glow}40, inset 0 0 15px ${rarity.glow}20`
      }
      overflow="hidden"
      transform={isSelected ? "translateZ(20px) scale(1.1)" : "translateZ(0) scale(1)"}
      animation={isSelected 
        ? `holographicGlow 2s ease-in-out infinite, pulse 1s ease-in-out infinite` 
        : showPopup 
          ? `popupAnimation 1s ease-out` 
          : "none"
      }
      _hover={{
        transform: isSelected ? "translateZ(30px) scale(1.15)" : "scale(1.02)",
        boxShadow: isSelected 
          ? "0 0 40px #ff00ff, 0 0 80px #00ffff, 0 0 120px #ff00ff, inset 0 0 40px rgba(255, 255, 255, 0.4)"
          : `0 0 25px ${rarity.glow}60, inset 0 0 25px ${rarity.glow}30`,
      }}
      transition="all 0.3s ease"
      zIndex={isSelected ? 10 : 1}
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Selected Game Overlay */}
      {isSelected && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="linear-gradient(45deg, rgba(255, 0, 255, 0.3), rgba(0, 255, 255, 0.3))"
          borderRadius="lg"
          zIndex={1}
          animation={`pulse 1s ease-in-out infinite`}
        />
      )}

      {/* Selected Game Badge */}
      {isSelected && (
        <Box
          position="absolute"
          top={-2}
          right={-2}
          bg="linear-gradient(45deg, #ff00ff, #00ffff)"
          color="black"
          fontSize="xs"
          fontWeight="bold"
          px={2}
          py={1}
          borderRadius="full"
          zIndex={2}
          animation={`spin 2s linear infinite`}
          fontFamily="mono"
          letterSpacing="1px"
        >
          ⭐ PICKED ⭐
        </Box>
      )}

      {/* Game Image */}
      <Box
        w="100%"
        h="160px"
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
            <Icon as={FaGamepad} boxSize="48px" />
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
