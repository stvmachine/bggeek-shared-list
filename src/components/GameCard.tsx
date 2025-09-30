import {
  Badge,
  Box,
  HStack,
  Icon,
  Skeleton,
  Text,
  TextProps,
} from "@chakra-ui/react";
import { MemberAvatar } from "./MemberAvatar";
import Image from "next/image";
import React from "react";
import { FaClock, FaStar, FaUsers } from "react-icons/fa";
import { GameOwner } from "../types";

export interface GameCardProps {
  id: string;
  name: string;
  thumbnail?: string;
  yearPublished?: string;
  minPlayers?: number;
  maxPlayers?: number;
  playingTime?: number;
  averageRating?: number;
  owners?: GameOwner[];
}

// Extend Chakra UI types to include custom props
declare module "@chakra-ui/react" {
  interface TextProps {
    noOfLines?: number;
  }

  interface StackProps {
    spacing?: number | string;
  }

  interface WrapProps {
    spacing?: number | string;
  }

  interface SimpleGridProps {
    spacing?: number | string;
    gap?: number | string;
  }
}

// Type-safe wrapper for Text with noOfLines
const TextWithEllipsis: React.FC<TextProps & { noOfLines?: number }> = ({
  noOfLines,
  children,
  ...rest
}) => (
  <Text noOfLines={noOfLines} {...rest}>
    {children}
  </Text>
);

const GameCard: React.FC<GameCardProps> = ({
  id,
  name,
  thumbnail,
  minPlayers = 0,
  maxPlayers = 0,
  playingTime = 0,
  averageRating = 0,
  owners = [],
}) => {
  // Format playing time
  const formatPlayingTime = (minutes: number) => {
    if (!minutes) return "N/A";
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Don't trigger the link if clicking on interactive elements like buttons
    const target = e.target as HTMLElement;
    if (target.closest('button, a, [role="button"]')) {
      return;
    }
    window.open(
      `https://boardgamegeek.com/boardgame/${id}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <Box
      as="article"
      bg="white"
      borderRadius="xl"
      overflow="hidden"
      boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
      borderWidth="1px"
      borderColor="gray.100"
      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      _hover={{
        transform: "translateY(-6px)",
        boxShadow:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        borderColor: "blue.200",
      }}
      h="100%"
      display="flex"
      flexDirection="column"
      position="relative"
      cursor="pointer"
      onClick={handleCardClick}
    >
      {/* Game Image */}
      <Box position="relative" pt="75%" bg="gray.100">
        <Box position="absolute" top={0} left={0} right={0} bottom={0}>
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{
                objectFit: "contain",
                width: "100%",
                height: "100%",
              }}
              unoptimized={!thumbnail.includes("boardgamegeek.com")}
              priority={false}
              quality={90}
            />
          ) : (
            <Skeleton height="100%" width="100%" />
          )}
        </Box>

        {/* Rating Badge */}
        {averageRating > 0 && (
          <Badge
            position="absolute"
            top={3}
            right={3}
            bg="rgba(0, 0, 0, 0.8)"
            color="white"
            borderRadius="full"
            px={3}
            py={1}
            display="flex"
            alignItems="center"
            gap={1.5}
            backdropFilter="blur(4px)"
            border="1px solid rgba(255, 255, 255, 0.1)"
            boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1)"
          >
            <Icon as={FaStar} color="yellow.300" boxSize={3} />
            <Text as="span" fontSize="xs" fontWeight="semibold">
              {averageRating.toFixed(1)}
            </Text>
          </Badge>
        )}
      </Box>

      {/* Game Info */}
      <Box p={3} flex={1} display="flex" flexDirection="column">
        {/* Game Name */}
        <TextWithEllipsis
          fontWeight="semibold"
          fontSize="sm"
          mb={2}
          noOfLines={2}
          title={name}
        >
          {name}
        </TextWithEllipsis>

        {/* Game Stats */}
        <HStack spacing={3} mt="auto" pt={2} color="gray.600">
          <HStack spacing={1}>
            <Icon as={FaUsers} boxSize={3} />
            <Text fontSize="xs">
              {minPlayers === maxPlayers
                ? minPlayers
                : `${minPlayers}-${maxPlayers}`}
            </Text>
          </HStack>

          {playingTime > 0 && (
            <HStack spacing={1}>
              <Icon as={FaClock} boxSize={3} />
              <Text fontSize="xs">{formatPlayingTime(playingTime)}</Text>
            </HStack>
          )}
        </HStack>

        {/* Owners */}
        {owners.length > 0 && (
          <Box mt={2} pt={2} borderTopWidth="1px" borderTopColor="gray.100">
            <Text fontSize="xs" color="gray.500" mb={1}>
              Owned by:
            </Text>
            <HStack spacing={1.5} mt={1.5} flexWrap="wrap">
              {owners.map(owner => (
                <Box key={owner.username}>
                  <MemberAvatar
                    username={owner.username}
                    showUsername={false}
                    size="xs"
                    spacing="1"
                  />
                </Box>
              ))}
            </HStack>
          </Box>
        )}
      </Box>
    </Box>
  );
};

// Export the GameCard component with its props type
export default React.memo(GameCard);
