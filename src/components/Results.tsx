import React from "react";
import {
  Box,
  Container,
  Heading,
  LinkBox,
  LinkOverlay,
  List,
  ListItem,
  Text,
  Wrap,
  HStack,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import SortBar from "../components/SortBar";
import { useSearch } from "../hooks/useSearch";
import { IItem } from "../utils/types";
import { useMembers } from "../contexts/MemberContext";

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
  const checkedMembers = Object.keys(watchedMembers).reduce(
    (accum: string[], key: string) => {
      if (watchedMembers[key]) {
        accum.push(key);
      }
      return accum;
    },
    []
  );

  return (
    <Container mt={10} maxWidth={"100%"}>
      {checkedMembers?.length > 0 ? (
        <Heading fontSize={"2xl"} mb={10}>
          {`Displaying ${results.length} games owned for the following members:`}
          <List.Root>
            <HStack gap={3} mt={4} flexWrap="wrap">
              {checkedMembers.map((member, index) => {
                const memberData = getMemberData(member);
                if (!memberData) return null;
                
                return (
                  <ListItem key={`${member}_${index}`}>
                    <LinkBox>
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
                  </ListItem>
                );
              })}
            </HStack>
          </List.Root>
        </Heading>
      ) : (
        <Heading fontSize={"2xl"} mb={10}>
          Please select at least one member to display their collection.
        </Heading>
      )}
      <SortBar />
      <Wrap align="center" gap="3">
        {results.length > 0 &&
          results.map(({ thumbnail, name, owners, objectid }: IItem, index) => (
            <GameCard
              image={thumbnail}
              key={`${objectid}_${index}`}
              bgName={name.text}
              owners={owners}
              objectid={objectid}
            />
          ))}
      </Wrap>
    </Container>
  );
});

Results.displayName = 'Results';

export default Results;
