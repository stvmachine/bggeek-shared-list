import {
  Badge,
  Box,
  Flex,
  Heading,
  IconButton,
  Show,
  Text,
  VStack,
  Wrap,
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
            <Wrap gap={4} justify="flex-start">
              {games.map(
                (
                  { thumbnail, name, owners, objectid }: BggCollectionItem,
                  index
                ) => (
                  <GameCard
                    image={thumbnail}
                    key={`${objectid}_${index}`}
                    bgName={name.text}
                    owners={owners}
                    objectid={objectid}
                  />
                )
              )}
            </Wrap>
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
