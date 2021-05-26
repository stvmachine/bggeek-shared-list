import React from "react";
import {
  Center,
  Container,
  Heading,
  ListItem,
  LinkBox,
  LinkOverlay,
  Skeleton,
  Text,
  UnorderedList,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import Image from "next/image";
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
        <Heading fontSize={"2xl"} mb={10}>
          Please select at least one member to display their collection.
        </Heading>
      )}
      <Wrap align="center">
        {results.length > 0 &&
          results.map(({ thumbnail, objectid }: IItem, index) => (
            <WrapItem key={`${objectid}_${index}`}>
              <LinkBox>
                <Center w={["110px", "180px"]} h={["110px", "180px"]}>
                  <LinkOverlay
                    href={`https://boardgamegeek.com/boardgame/${objectid}`}
                    isExternal
                  >
                    {thumbnail ? (
                      <Image
                        layout="fill"
                        objectFit="contain"
                        src={thumbnail}
                      />
                    ) : (
                      <Skeleton height="100%" width="100%" />
                    )}
                  </LinkOverlay>
                </Center>
              </LinkBox>
            </WrapItem>
          ))}
      </Wrap>
    </Container>
  );
};

export default Results;
