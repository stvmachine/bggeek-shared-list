import {
  Badge,
  Box,
  Button,
  ButtonProps,
  Flex,
  Heading,
  Icon,
  LinkBox,
  LinkOverlay,
  SimpleGrid,
  SimpleGridProps,
  Skeleton,
  Text,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { FiUsers } from "react-icons/fi"; // Used in EmptyState component
// Other icons commented out until needed
// import { FiFilter, FiInfo } from "react-icons/fi";
import SortBar from "../components/SortBar";
import { MemberAvatar } from "./MemberAvatar";
import { useMembers } from "../contexts/MemberContext";
import { useSearch } from "../hooks/useSearch";
import { GroupedGames, groupGames, GroupingOption } from "../utils/grouping";
import { sortGames, SortOption } from "../utils/sorting";
import { BggCollectionItem } from "../utils/types";

import CollapsibleGroup from "./CollapsibleGroup";
import GameCard from "./GameCard";

// Type-safe Button with leftIcon
const IconButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & { leftIcon?: React.ReactElement }
>(({ leftIcon, children, ...rest }, ref) => {
  // Create a new props object without leftIcon to avoid TypeScript errors
  const buttonProps = { ...rest } as any;

  // Only add leftIcon if it's provided
  if (leftIcon) {
    buttonProps.leftIcon = leftIcon;
  }

  // Use Chakra UI's Button with the spread props
  return (
    <Button ref={ref} {...buttonProps}>
      {children}
    </Button>
  );
});
IconButton.displayName = "IconButton";

// Type-safe SimpleGrid with gap
const Grid: React.FC<SimpleGridProps & { gap?: number }> = ({
  gap = 4,
  ...rest
}) => <SimpleGrid spacing={`${gap * 0.25}rem`} {...rest} />;

// Skeleton loader for game cards
const GameCardSkeleton = () => (
  <Box
    bg="white"
    borderRadius="lg"
    overflow="hidden"
    boxShadow="sm"
    borderWidth="1px"
  >
    <Skeleton height="200px" />
    <Box p={4}>
      <Skeleton height="20px" mb={2} width="80%" />
      <Skeleton height="16px" width="60%" />
    </Box>
  </Box>
);

// Empty state component
const EmptyState = ({ onAddMembers }: { onAddMembers: () => void }) => (
  <Box
    border="2px dashed"
    borderColor="gray.200"
    borderRadius="lg"
    p={8}
    textAlign="center"
    bg="white"
    maxW="500px"
    mx="auto"
    my={8}
  >
    <Icon as={FiUsers} boxSize={10} color="blue.500" mb={4} />
    <Heading as="h3" size="md" mb={2} color="gray.700">
      No Members Selected
    </Heading>
    <Text color="gray.500" mb={6}>
      Add board game collection members to get started
    </Text>
    <IconButton
      colorScheme="blue"
      leftIcon={<FiUsers />}
      onClick={onAddMembers}
      size="md"
    >
      Add Members
    </IconButton>
  </Box>
);

type ResultsProps = {
  boardgames?: BggCollectionItem[];
};

const Results = React.memo(({ boardgames }: ResultsProps) => {
  // Get search results
  const { results: searchResults } = useSearch<BggCollectionItem>(
    boardgames || [],
    {
      keys: ["name.text"],
    }
  );
  const { watch } = useFormContext();
  const { getMemberData } = useMembers();
  const watchedMembers = watch("members");
  const groupBy = watch("groupBy") || "none";
  const orderBy = watch("orderBy") || "name_asc";
  const loading = false;

  // State for collapsed groups
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(
    new Set()
  );

  // Helper functions for managing collapsed groups
  const toggleGroup = (groupName: string) => {
    setCollapsedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupName)) {
        newSet.delete(groupName);
      } else {
        newSet.add(groupName);
      }
      return newSet;
    });
  };

  const isGroupCollapsed = (groupName: string) =>
    collapsedGroups.has(groupName);

  // Helper functions for bulk operations
  const collapseAllGroups = () => {
    const allGroupNames = Object.keys(groupedResults);
    setCollapsedGroups(new Set(allGroupNames));
  };

  const expandAllGroups = () => {
    setCollapsedGroups(new Set());
  };

  const checkedMembers = Object.keys(watchedMembers).reduce(
    (accum: string[], key: string) => {
      if (watchedMembers[key]) {
        accum.push(key);
      }
      return accum;
    },
    []
  );

  // Sort the results first
  const sortedResults = sortGames(searchResults || [], orderBy as SortOption);

  // Group the sorted results based on the selected grouping option
  const groupedResults: GroupedGames = groupGames(
    sortedResults,
    groupBy as GroupingOption
  );

  return (
    <Box flex="1" p={{ base: 2, md: 4 }}>
      {checkedMembers?.length > 0 ? (
        <Box
          border="1px solid"
          borderColor="gray.200"
          borderRadius="lg"
          p={{ base: 3, md: 4 }}
          mb={6}
          bg="white"
          boxShadow="sm"
        >
          <VStack gap={4} align="stretch">
            <Flex
              direction={{ base: "column", sm: "row" }}
              justify="space-between"
              gap={3}
            >
              <Flex align="center" gap={3}>
                <Heading fontSize={{ base: "lg", md: "xl" }} color="gray.700">
                  🎮 Game Collection
                </Heading>
                <Badge colorScheme="blue" variant="subtle" fontSize="sm">
                  {searchResults?.length || 0}{" "}
                  {searchResults?.length === 1 ? "game" : "games"}
                </Badge>
              </Flex>
            </Flex>

            <Box>
              <Text fontSize="sm" color="gray.600" mb={3}>
                Displaying games owned by:
              </Text>
              <Wrap gap={2}>
                {checkedMembers.map((member, index) => {
                  const memberData = getMemberData(member);
                  if (!memberData) return null;

                  return (
                    <LinkBox key={`${member}_${index}`}>
                      <LinkOverlay
                        href={`https://boardgamegeek.com/user/${member}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Box
                          border="1px solid"
                          borderColor="gray.200"
                          borderRadius="lg"
                          p={3}
                          _hover={{
                            borderColor: "blue.300",
                            bg: "blue.50",
                            transform: "translateY(-1px)",
                            boxShadow: "md",
                          }}
                          transition="all 0.2s"
                          cursor="pointer"
                        >
                          <MemberAvatar username={member} size="md" />
                        </Box>
                      </LinkOverlay>
                    </LinkBox>
                  );
                })}
              </Wrap>
            </Box>
          </VStack>
        </Box>
      ) : (
        <EmptyState onAddMembers={() => {}} />
      )}

      <SortBar />

      {groupBy !== "none" && Object.keys(groupedResults).length > 0 && (
        <Box mb={4}>
          <Flex gap={2} justify="flex-end">
            <Button
              size="sm"
              variant="outline"
              onClick={expandAllGroups}
              fontSize="xs"
            >
              Expand All
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={collapseAllGroups}
              fontSize="xs"
            >
              Collapse All
            </Button>
          </Flex>
        </Box>
      )}

      {groupBy === "none" ? (
        <Box>
          {/* Loading state removed as it's not being used */}
          {loading ? (
            <Grid columns={{ base: 2, sm: 3, md: 4, lg: 5, xl: 6 }} gap={4}>
              {[...Array(12)].map((_, i) => (
                <GameCardSkeleton key={i} />
              ))}
            </Grid>
          ) : sortedResults.length > 0 ? (
            <Grid columns={{ base: 2, sm: 3, md: 4, lg: 5, xl: 6 }} gap={4}>
              {sortedResults.map((game: BggCollectionItem) => {
                const gameData = {
                  id: game.objectid,
                  name:
                    typeof game.name === "string"
                      ? game.name
                      : (game.name as any)?.text || "Unknown Game",
                  thumbnail: game.thumbnail,
                  yearPublished:
                    typeof game.yearpublished === "string"
                      ? game.yearpublished
                      : (game.yearpublished as any)?.text || "",
                  minPlayers:
                    (game.stats as any)?.minplayers?.value ||
                    (game.stats as any)?.minplayers ||
                    0,
                  maxPlayers:
                    (game.stats as any)?.maxplayers?.value ||
                    (game.stats as any)?.maxplayers ||
                    0,
                  playingTime:
                    (game.stats as any)?.playingtime?.value ||
                    (game.stats as any)?.playingtime ||
                    0,
                  averageRating:
                    (game.stats as any)?.rating?.average?.value ||
                    (game.stats as any)?.rating?.average ||
                    0,
                  owners: game.owners || [],
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
            </Grid>
          ) : (
            <Box
              border="1px solid"
              borderColor="gray.200"
              borderRadius="lg"
              p={8}
              textAlign="center"
              bg="white"
            >
              <Text color="gray.500" fontSize="lg">
                No games found matching your criteria
              </Text>
            </Box>
          )}
        </Box>
      ) : (
        <VStack align="stretch" gap={6}>
          {Object.entries(groupedResults).map(([groupName, games]) => (
            <CollapsibleGroup
              key={groupName}
              groupName={groupName}
              games={games}
              isCollapsed={isGroupCollapsed(groupName)}
              onToggle={() => toggleGroup(groupName)}
            />
          ))}
        </VStack>
      )}
    </Box>
  );
});

Results.displayName = "Results";

export default Results;
