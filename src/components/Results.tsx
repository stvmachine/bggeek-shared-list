import React, { useState, useEffect } from "react";
import {
  Wrap,
  WrapItem,
  Image,
  Container,
  Heading,
  Text,
  UnorderedList,
  ListItem,
  LinkBox,
  LinkOverlay,
} from "@chakra-ui/react";
import { useFuzzy } from "react-use-fuzzy";
import { useFormContext } from "react-hook-form";
import { ItemType } from "../utils/types";
import useDebounce from "../hooks/useDebounce";
import { filterByNumPlayers, filterByPlayingTime } from "../hooks/useFilters";

type ResultsProps = {
  members: string[];
  boardgames: ItemType[];
};

const Results = ({ members, boardgames }: ResultsProps) => {
  const { watch } = useFormContext();
  const watchAllFields = watch();
  console.log(watchAllFields)

  return (
    <Container mt={10} maxWidth={["100%", "80%"]}>
      {members && (
        <Heading fontSize={"3xl"} mb={10}>
          Displaying {boardgames.length} games owned for the following members:
          <UnorderedList>
            {members.map((member, index) => (
              <ListItem key={`${member}_${index}`}>
                <LinkBox>
                  <LinkOverlay
                    href={`https://boardgamegeek.com/user/${member}`}
                    isExternal
                  >
                    <Text color="tomato">{member}</Text>
                  </LinkOverlay>
                </LinkBox>
              </ListItem>
            ))}
          </UnorderedList>
        </Heading>
      )}
      <Wrap>
        {boardgames.length > 0 &&
          boardgames.map(({ thumbnail, objectid }: ItemType, index) => (
            <WrapItem key={`${objectid}_${index}`}>
              <LinkBox>
                <LinkOverlay
                  href={`https://boardgamegeek.com/boardgame/${objectid}`}
                  isExternal
                >
                  <Image
                    boxSize={["92px", "180px"]}
                    objectFit="contain"
                    src={thumbnail}
                  />
                </LinkOverlay>
              </LinkBox>
            </WrapItem>
          ))}
      </Wrap>
    </Container>
  );
};

export default Results;
