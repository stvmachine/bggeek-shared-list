import React from "react";
import {
  Container,
  Heading,
  ListItem,
  LinkBox,
  LinkOverlay,
  Text,
  UnorderedList,
  Wrap,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import { IItem } from "../utils/types";
import { useSearch } from "../hooks/useSearch";
import SortBar from "../components/SortBar";

import GameCard from "./GameCard";

type ResultsProps = {
  boardgames: IItem[];
};

const Results = ({ boardgames }: ResultsProps) => {
  const { results } = useSearch<IItem>(boardgames, {
    keys: ["name.text"],
  });
  const { watch } = useFormContext();
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
    <Container mt={10} maxWidth={["100%", "80%"]}>
      {checkedMembers?.length > 0 ? (
        <Heading fontSize={"2xl"} mb={10}>
          Displaying {results.length} games owned for the following members:
          <UnorderedList>
            {checkedMembers.map((member, index) => (
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
      ) : (
        <Heading fontSize={"2xl"} mb={10}>
          Please select at least one member to display their collection.
        </Heading>
      )}

      <SortBar />
      <Wrap align="center" spacing="3">
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
};

export default Results;
