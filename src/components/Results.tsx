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
import { ItemType } from "../utils/types";
import { useSearch } from "../hooks/useSearch";

type ResultsProps = {
  members: string[];
  boardgames: ItemType[];
};

const Results = ({ members, boardgames }: ResultsProps) => {
  const { results } = useSearch<ItemType>(boardgames, {
    keys: ["name.text"],
  });

  return (
    <Container mt={10} maxWidth={["100%", "80%"]}>
      {members && (
        <Heading fontSize={"2xl"} mb={10}>
          Displaying {results.length} games owned for the following members:
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
        {results.length > 0 &&
          results.map(({ thumbnail, objectid }: ItemType, index) => (
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
