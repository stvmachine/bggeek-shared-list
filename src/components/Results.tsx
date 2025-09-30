import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  LinkBox,
  LinkOverlay,
  SimpleGrid,
  Text,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { FiUsers } from "react-icons/fi";
import { useMembers } from "../contexts/MemberContext";
import { useFuzzySearch } from "../hooks/useFuzzySearch";
import { ICollectionItem } from "../types";
import { GroupedGames, groupGames, GroupingOption } from "../utils/grouping";
import {
  filterByNumPlayers,
  filterByPlayingTime,
  orderByFn,
} from "../utils/search";
import CollapsibleGroup from "./CollapsibleGroup";
import GameCard from "./GameCard";
import { MemberAvatar } from "./MemberAvatar";
import SortBar from "./SortBar";

// Type-safe SimpleGrid with gap
const Grid = ({
  gap = 4,
  ...rest
}: { gap?: number } & React.ComponentProps<typeof SimpleGrid>) => (
  <SimpleGrid
    columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }}
    spacing={gap}
    {...rest}
  />
);

// Empty state component
const EmptyState = () => (
  <Box
    border="1px dashed"
    borderColor="gray.300"
    borderRadius="lg"
    p={8}
    textAlign="center"
    bg="white"
  >
    <Icon as={FiUsers} boxSize={8} color="gray.400" mb={3} />
    <Text fontSize="lg" color="gray.600" mb={2}>
      No collection members selected
    </Text>
    <Text color="gray.500" fontSize="sm">
      Select some collection members to see their games
    </Text>
  </Box>
);

type ResultsProps = {
  boardgames?: ICollectionItem[];
};

const Results = React.memo(({ boardgames = [] }: ResultsProps) => {
  const { watch } = useFormContext();
  const { getMemberData } = useMembers();

  // Form values
  const keyword = watch("keyword", "");
  const watchedMembers = watch("members", {});
  const groupBy = watch("groupBy", "none");
  const orderBy = watch("orderBy", "name_asc");
  const playingTime = watch("playingTime", "");
  const numberOfPlayers = watch("numberOfPlayers", "");

  // State for collapsed groups
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(
    new Set()
  );

  // Use the simplified fuzzy search hook with debouncing
  const searchResults = useFuzzySearch<ICollectionItem>(boardgames, keyword, {
    keys: ["name.text", "originalname"],
    threshold: 0.3,
    debounceTime: 300, // 300ms debounce time
    minSearchLength: 2, // Minimum characters to start searching
  });

  // Apply filters and sorting
  const filteredResults = useMemo(() => {
    if (!searchResults) return [];

    let results = [...searchResults];

    // Filter by members who have the game
    const filteredMembers = Object.entries(watchedMembers || {})
      .filter(([_, isSelected]) => isSelected)
      .map(([username]) => username);

    // If no members are selected, show no games
    if (filteredMembers.length === 0) {
      return [];
    }

    // Filter games by selected members
    results = results.filter(game =>
      game.owners?.some((owner: { username: string }) =>
        filteredMembers.includes(owner.username)
      )
    );

    // Apply other filters
    results = filterByPlayingTime(results, playingTime);
    results = filterByNumPlayers(results, numberOfPlayers);

    // Apply sorting
    return orderByFn(results, orderBy);
  }, [searchResults, watchedMembers, playingTime, numberOfPlayers, orderBy]);

  // Group the results based on the selected grouping option
  const groupedResults: GroupedGames = groupGames(
    filteredResults,
    groupBy as GroupingOption
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

  const checkedMembers = useMemo(
    () =>
      watchedMembers && typeof watchedMembers === "object"
        ? Object.entries(watchedMembers)
            .filter(([_, isSelected]) => isSelected)
            .map(([username]) => username)
        : [],
    [watchedMembers]
  );

  // Get actual owners of filtered games
  const actualOwners = useMemo(() => {
    if (filteredResults.length === 0) return [];

    const owners = new Set<string>();
    filteredResults.forEach(game => {
      game.owners?.forEach((owner: { username: string }) => {
        if (checkedMembers.includes(owner.username)) {
          owners.add(owner.username);
        }
      });
    });

    return Array.from(owners);
  }, [filteredResults, checkedMembers]);

  return (
    <Box flex="1" p={{ base: 2, md: 4 }}>
      {checkedMembers.length > 0 ? (
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
                  {boardgames?.length || 0}{" "}
                  {boardgames?.length === 1 ? "game" : "games"}
                </Badge>
                {filteredResults.length !== boardgames?.length && (
                  <Badge colorScheme="green" variant="outline" fontSize="sm">
                    {filteredResults.length} shown
                  </Badge>
                )}
              </Flex>
            </Flex>

            <Box>
              <Text fontSize="sm" color="gray.600" mb={3}>
                Displaying games owned by:
              </Text>
              <Wrap gap={2}>
                {actualOwners.map(member => {
                  const memberData = getMemberData(member);
                  if (!memberData) return null;

                  return (
                    <LinkBox key={member}>
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
        <EmptyState />
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
          {filteredResults.length > 0 && (
            <Box
              mb={4}
              p={3}
              bg="gray.50"
              borderRadius="md"
              border="1px solid"
              borderColor="gray.200"
            >
              <Text fontSize="sm" color="gray.600">
                Showing {filteredResults.length} of {boardgames?.length || 0}{" "}
                games
                {searchResults &&
                  searchResults.length !== boardgames?.length && (
                    <Text as="span" color="blue.600" fontWeight="medium">
                      {" "}
                      (filtered)
                    </Text>
                  )}
              </Text>
            </Box>
          )}
          <Grid gap={4}>
            {filteredResults.map(game => (
              <GameCard
                key={game.objectId}
                id={game.objectId}
                name={game.name}
                thumbnail={game.thumbnail}
                yearPublished={game.yearPublished?.toString()}
                minPlayers={game.stats?.minPlayers}
                maxPlayers={game.stats?.maxPlayers}
                playingTime={game.stats?.playingTime}
                averageRating={game.stats?.average}
                owners={game.owners || []}
              />
            ))}
          </Grid>
        </Box>
      ) : (
        <Box>
          {Object.entries(groupedResults).map(([groupName, games]) => (
            <CollapsibleGroup
              key={groupName}
              groupName={groupName}
              isCollapsed={isGroupCollapsed(groupName)}
              onToggle={() => toggleGroup(groupName)}
              count={games.length}
            >
              <Grid gap={4} mt={4}>
                {games.map((game: any) => {
                  // Safely extract values with proper type checking
                  const id =
                    typeof game.objectId === "number"
                      ? game.objectId.toString()
                      : String(game.objectId || "");
                  const name =
                    game.name?.text || game.originalname || "Unknown Game";
                  const thumbnail = game.thumbnail || "";
                  const yearPublished = game.yearpublished
                    ? String(game.yearpublished)
                    : "";

                  // Safely extract numeric values with fallbacks
                  const minPlayers =
                    typeof game.stats?.minplayers === "number"
                      ? game.stats.minplayers
                      : typeof game.stats?.minplayers?.value === "number"
                        ? game.stats.minplayers.value
                        : 0;

                  const maxPlayers =
                    typeof game.stats?.maxplayers === "number"
                      ? game.stats.maxplayers
                      : typeof game.stats?.maxplayers?.value === "number"
                        ? game.stats.maxplayers.value
                        : 0;

                  const playingTime =
                    typeof game.stats?.playingtime === "number"
                      ? game.stats.playingtime
                      : typeof game.stats?.playingtime?.value === "number"
                        ? game.stats.playingtime.value
                        : 0;

                  const averageRating =
                    typeof game.stats?.rating?.average === "number"
                      ? game.stats.rating.average
                      : typeof game.stats?.rating?.average?.value === "number"
                        ? game.stats.rating.average.value
                        : 0;

                  return (
                    <GameCard
                      key={id}
                      id={id}
                      name={name}
                      thumbnail={thumbnail}
                      yearPublished={yearPublished}
                      minPlayers={minPlayers}
                      maxPlayers={maxPlayers}
                      playingTime={playingTime}
                      averageRating={averageRating}
                    />
                  );
                })}
              </Grid>
            </CollapsibleGroup>
          ))}
        </Box>
      )}
    </Box>
  );
});

Results.displayName = "Results";

export default Results;
