import {
  Badge,
  Box,
  Flex,
  Heading,
  IconButton,
  Show,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";

import { BggCollectionItem } from "../utils/types";

import GameCard from "./GameCard";

type CollapsibleGroupProps = {
  groupName: string;
  games: BggCollectionItem[];
  isCollapsed: boolean;
  onToggle: () => void;
};

const CollapsibleGroup: React.FC<CollapsibleGroupProps> = ({
  groupName,
  games,
  isCollapsed,
  onToggle,
}) => {
  return (
    <Box
      border="1px solid"
      borderColor="gray.200"
      borderRadius="lg"
      p={4}
      bg="white"
      transition="all 0.2s"
      _hover={{
        borderColor: "gray.300",
        boxShadow: "sm",
      }}
    >
      <VStack align="stretch" gap={4}>
        <Flex align="center" gap={3}>
          <IconButton
            aria-label={isCollapsed ? "Expand group" : "Collapse group"}
            size="sm"
            variant="ghost"
            onClick={onToggle}
            _hover={{
              bg: "blue.50",
              color: "blue.600",
            }}
            fontSize="sm"
            minW="28px"
            h="28px"
            borderRadius="md"
            transition="all 0.2s"
          >
            {isCollapsed ? "▶" : "▼"}
          </IconButton>
          <Heading
            fontSize="lg"
            color="gray.700"
            flex="1"
            cursor="pointer"
            onClick={onToggle}
            _hover={{
              color: "blue.600",
            }}
            transition="color 0.2s"
          >
            {groupName}
          </Heading>
          <Badge colorScheme="blue" variant="subtle" fontSize="sm">
            {games.length} {games.length === 1 ? "Game" : "Games"}
          </Badge>
        </Flex>

        <Show when={!isCollapsed}>
          {games.length > 0 ? (
            <SimpleGrid
              columns={{ base: 2, sm: 3, md: 4, lg: 5, xl: 6 }}
              gap={4}
            >
              {games.map((game: BggCollectionItem) => {
                const gameData = {
                  id: game.objectid,
                  name: typeof game.name === 'string' ? game.name : (game.name as any)?.text || 'Unknown Game',
                  thumbnail: game.thumbnail,
                  yearPublished: typeof game.yearpublished === 'string' 
                    ? game.yearpublished 
                    : (game.yearpublished as any)?.text || '',
                  minPlayers: (game.stats as any)?.minplayers?.value || (game.stats as any)?.minplayers || 0,
                  maxPlayers: (game.stats as any)?.maxplayers?.value || (game.stats as any)?.maxplayers || 0,
                  playingTime: (game.stats as any)?.playingtime?.value || (game.stats as any)?.playingtime || 0,
                  averageRating: (game.stats as any)?.rating?.average?.value || (game.stats as any)?.rating?.average || 0,
                  owners: game.owners || []
                };

                return (
                  <GameCard
                    key={gameData.id}
                    id={gameData.id}
                    name={gameData.name}
                    thumbnail={gameData.thumbnail}
                    yearPublished={gameData.yearPublished}
                    minPlayers={gameData.minPlayers}
                    maxPlayers={gameData.maxPlayers}
                    playingTime={gameData.playingTime}
                    averageRating={gameData.averageRating}
                    owners={gameData.owners}
                  />
                );
              })}
            </SimpleGrid>
          ) : (
            <Text color="gray.500" fontSize="sm" textAlign="center" py={4}>
              No games in this group
            </Text>
          )}
        </Show>
      </VStack>
    </Box>
  );
};

export default CollapsibleGroup;
