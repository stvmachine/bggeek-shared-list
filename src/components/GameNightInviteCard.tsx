import { Box, Button, Flex, Text, VStack } from "@chakra-ui/react";
import React from "react";
import { FaGamepad, FaUsers, FaStar } from "react-icons/fa";

interface GameNightInviteCardProps {
  onInviteClick?: () => void;
}

const GameNightInviteCard: React.FC<GameNightInviteCardProps> = ({
  onInviteClick,
}) => {
  return (
    <Box
      position="relative"
      p={8}
      bg="linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)"
      borderRadius="xl"
      border="2px solid"
      borderColor="cyan.400"
      boxShadow="0 0 30px rgba(0, 255, 255, 0.3), inset 0 0 30px rgba(0, 255, 255, 0.1)"
      overflow="hidden"
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          linear-gradient(45deg, transparent 25%, rgba(0, 255, 255, 0.1) 25%, rgba(0, 255, 255, 0.1) 50%, transparent 50%, transparent 75%, rgba(0, 255, 255, 0.1) 75%),
          linear-gradient(-45deg, transparent 25%, rgba(255, 0, 255, 0.1) 25%, rgba(255, 0, 255, 0.1) 50%, transparent 50%, transparent 75%, rgba(255, 0, 255, 0.1) 75%)
        `,
        backgroundSize: "20px 20px",
        opacity: 0.3,
        zIndex: 1,
      }}
    >
      {/* Animated border effect */}
      <Box
        position="absolute"
        top="-2px"
        left="-2px"
        right="-2px"
        bottom="-2px"
        background="linear-gradient(45deg, #ff00ff, #00ffff, #ff00ff, #00ffff)"
        backgroundSize="400% 400%"
        borderRadius="xl"
        zIndex={-1}
        animation="gradientShift 3s ease infinite"
        sx={{
          "@keyframes gradientShift": {
            "0%": { backgroundPosition: "0% 50%" },
            "50%": { backgroundPosition: "100% 50%" },
            "100%": { backgroundPosition: "0% 50%" },
          },
        }}
      />

      {/* Content */}
      <VStack spacing={6} align="center" position="relative" zIndex={2}>
        {/* Header with neon glow */}
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
            🎮 GAME NIGHT NFT 🎮
          </Text>
          <Text
            fontSize="lg"
            color="pink.400"
            textAlign="center"
            textShadow="0 0 5px #ff00ff"
            fontFamily="mono"
            letterSpacing="1px"
          >
            DIGITAL COLLECTIBLE
          </Text>
        </VStack>

        {/* Stats grid */}
        <Flex
          gap={6}
          wrap="wrap"
          justify="center"
          p={4}
          bg="rgba(0, 0, 0, 0.5)"
          borderRadius="lg"
          border="1px solid"
          borderColor="cyan.300"
        >
          <VStack spacing={1}>
            <FaUsers color="#00ffff" size="24px" />
            <Text fontSize="sm" color="cyan.300" fontFamily="mono">
              MULTIPLAYER
            </Text>
            <Text fontSize="lg" color="white" fontWeight="bold">
              2-8 PLAYERS
            </Text>
          </VStack>

          <VStack spacing={1}>
            <FaStar color="#ff00ff" size="24px" />
            <Text fontSize="sm" color="pink.300" fontFamily="mono">
              RARITY
            </Text>
            <Text fontSize="lg" color="white" fontWeight="bold">
              LEGENDARY
            </Text>
          </VStack>

          <VStack spacing={1}>
            <FaGamepad color="#00ff00" size="24px" />
            <Text fontSize="sm" color="green.300" fontFamily="mono">
              GENRE
            </Text>
            <Text fontSize="lg" color="white" fontWeight="bold">
              BOARD GAMES
            </Text>
          </VStack>
        </Flex>

        {/* Description */}
        <Box textAlign="center" maxW="md">
          <Text
            fontSize="md"
            color="gray.300"
            lineHeight="1.6"
            fontFamily="mono"
            letterSpacing="0.5px"
          >
            A unique digital collectible granting access to exclusive board game
            nights. Each NFT represents a verified ticket to the ultimate gaming
            experience.
          </Text>
        </Box>

        {/* Action button */}
        <Button
          onClick={onInviteClick}
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
          CLAIM YOUR TICKET
        </Button>

        {/* Bottom text */}
        <Text
          fontSize="xs"
          color="gray.400"
          textAlign="center"
          fontFamily="mono"
          letterSpacing="1px"
        >
          ⚡ POWERED BY BLOCKCHAIN ⚡
        </Text>
      </VStack>

      {/* Floating particles effect */}
      <Box
        position="absolute"
        top="10%"
        left="10%"
        w="4px"
        h="4px"
        bg="cyan.400"
        borderRadius="full"
        opacity={0.6}
        animation="float 4s ease-in-out infinite"
        sx={{
          "@keyframes float": {
            "0%, 100%": { transform: "translateY(0px)" },
            "50%": { transform: "translateY(-20px)" },
          },
        }}
      />
      <Box
        position="absolute"
        top="20%"
        right="15%"
        w="3px"
        h="3px"
        bg="pink.400"
        borderRadius="full"
        opacity={0.8}
        animation="float 3s ease-in-out infinite reverse"
      />
      <Box
        position="absolute"
        bottom="15%"
        left="20%"
        w="2px"
        h="2px"
        bg="green.400"
        borderRadius="full"
        opacity={0.7}
        animation="float 5s ease-in-out infinite"
      />
    </Box>
  );
};

export default GameNightInviteCard;
