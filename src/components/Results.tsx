import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  LinkBox,
  LinkOverlay,
  Text,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";

import SortBar from "../components/SortBar";
import { useMembers } from "../contexts/MemberContext";
import { useSearch } from "../hooks/useSearch";
import { GroupedGames, groupGames } from "../utils/grouping";
import { sortGames, SortOption } from "../utils/sorting";
import { BggCollectionItem } from "../utils/types";

import CollapsibleGroup from "./CollapsibleGroup";
import GameCard from "./GameCard";

type ResultsProps = {
  boardgames?: BggCollectionItem[];
};

const Results = React.memo(({ boardgames }: ResultsProps) => {
  const { results } = useSearch<BggCollectionItem>(boardgames || [], {
    keys: ["name.text"],
  });
  const { watch } = useFormContext();
  const { getMemberData } = useMembers();
  const watchedMembers = watch("members");
  const groupBy = watch("groupBy") || "none";
  const orderBy = watch("orderBy") || "name_asc";

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
  const sortedResults = sortGames(results, orderBy as SortOption);

  // Group the sorted results based on the selected grouping option
  const groupedResults: GroupedGames = groupGames(sortedResults, groupBy);

  return (
    <Box flex="1" p={4}>
      {checkedMembers?.length > 0 ? (
        <Box
          border="1px solid"
          borderColor="gray.200"
          borderRadius="lg"
          p={4}
          mb={6}
          bg="white"
        >
          <VStack gap={4} align="stretch">
            <Flex align="center" gap={3}>
              <Heading fontSize="xl" color="gray.700">
                🎮 Game Collection
              </Heading>
              <Badge colorScheme="blue" variant="subtle" fontSize="sm">
                {results.length} games
              </Badge>
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
                          <HStack gap={2}>
                            <Box
                              width="28px"
                              height="28px"
                              borderRadius="full"
                              bg={memberData.color.bg}
                              color={memberData.color.color}
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              fontSize="xs"
                              fontWeight="bold"
                            >
                              {memberData.initial}
                            </Box>
                            <Text fontWeight="medium" fontSize="sm">
                              {member}
                            </Text>
                          </HStack>
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
        <Box
          border="1px solid"
          borderColor="gray.200"
          borderRadius="lg"
          p={8}
          mb={6}
          textAlign="center"
          bg="white"
        >
          <Heading fontSize="xl" color="gray.500" mb={2}>
            👥 Select Members
          </Heading>
          <Text color="gray.600">
            Please select at least one member to display their collection.
          </Text>
        </Box>
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
          {sortedResults.length > 0 ? (
            <Wrap gap={4} justify="flex-start">
              {sortedResults.map(
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
