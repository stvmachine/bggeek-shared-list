import React from "react";
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
import { IItem } from "../utils/types";
import { useSearch } from "../hooks/useSearch";
import { useFormContext } from "react-hook-form";

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
        <Heading fontSize={"2xl"} mb={10}>Please select at least one member to display their collection.</Heading>
      )}
      <Wrap>
        {results.length > 0 &&
          results.map(({ thumbnail, objectid }: IItem, index) => (
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
