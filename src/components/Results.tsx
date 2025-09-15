import {
  Box,
  Container,
  Heading,
  HStack,
  LinkBox,
  LinkOverlay,
  Text,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import React from "react";
import { useFormContext } from "react-hook-form";
import SortBar from "../components/SortBar";
import { useMembers } from "../contexts/MemberContext";
import { useSearch } from "../hooks/useSearch";
import { IItem } from "../utils/types";
import { groupGames, GroupedGames } from "../utils/grouping";
import { sortGames, SortOption } from "../utils/sorting";

import GameCard from "./GameCard";

type ResultsProps = {
  boardgames?: IItem[];
};

const Results = React.memo(({ boardgames }: ResultsProps) => {
  const { results } = useSearch<IItem>(boardgames || [], {
    keys: ["name.text"],
  });
  const { watch } = useFormContext();
  const { getMemberData } = useMembers();
  const watchedMembers = watch("members");
  const groupBy = watch("groupBy") || "none";
  const orderBy = watch("orderBy") || "name_asc";
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
    <Container mt={10} maxWidth={"100%"}>
      {checkedMembers?.length > 0 ? (
        <Box mb={10}>
          <Heading fontSize={"2xl"} mb={4}>
            {`Displaying ${results.length} games owned for the following members:`}
          </Heading>
          <HStack gap={3} flexWrap="wrap">
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
                    <HStack gap={2}>
                      <Box
                        width="32px"
                        height="32px"
                        borderRadius="full"
                        bg={memberData.color.bg}
                        color={memberData.color.color}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        fontSize="sm"
                        fontWeight="bold"
                      >
                        {memberData.initial}
                      </Box>
                      <Text fontWeight="medium">{member}</Text>
                    </HStack>
                  </LinkOverlay>
                </LinkBox>
              );
            })}
          </HStack>
        </Box>
      ) : (
        <Heading fontSize={"2xl"} mb={10}>
          Please select at least one member to display their collection.
        </Heading>
      )}
      <SortBar />
      
      {groupBy === "none" ? (
        <Wrap align="center" gap="3">
          {sortedResults.length > 0 &&
            sortedResults.map(({ thumbnail, name, owners, objectid }: IItem, index) => (
              <GameCard
                image={thumbnail}
                key={`${objectid}_${index}`}
                bgName={name.text}
                owners={owners}
                objectid={objectid}
              />
            ))}
        </Wrap>
      ) : (
        <VStack align="stretch" gap={8}>
          {Object.entries(groupedResults).map(([groupName, games]) => (
            <Box key={groupName}>
              <Heading fontSize="xl" mb={4} color="gray.700">
                {groupName} ({games.length} {games.length === 1 ? 'Game' : 'Games'})
              </Heading>
              <Box height="1px" bg="gray.200" mb={4} />
              <Wrap align="center" gap="3">
                {games.map(({ thumbnail, name, owners, objectid }: IItem, index) => (
                  <GameCard
                    image={thumbnail}
                    key={`${objectid}_${index}`}
                    bgName={name.text}
                    owners={owners}
                    objectid={objectid}
                  />
                ))}
              </Wrap>
            </Box>
          ))}
        </VStack>
      )}
    </Container>
  );
});

Results.displayName = "Results";

export default Results;
