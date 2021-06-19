import React from "react";
import {
  Wrap,
  WrapItem,
  Image,
  Box,
  Container,
  Heading,
  Text,
  Stack,
} from "@chakra-ui/react";
import { IHotItem } from "../utils/types";
import { BggHotResponse } from "bgg-xml-api-client";

type HotGamesProps = {
  collectionData: BggHotResponse;
};

const HotGames = ({ collectionData }: HotGamesProps) => (
  <Box p={4}>
    <Stack spacing={4} as={Container} maxW={"3xl"} textAlign={"center"}>
      <Heading fontSize={"3xl"}>
        Have a shared collection with your friends
      </Heading>
      <Text color={"gray.600"} fontSize={"xl"}>
        Check easily any game from your community.
      </Text>
    </Stack>

    <Container maxW={"6xl"} mt={10}>
      <Wrap>
        {collectionData.item.length > 0 &&
          collectionData.item.map(({ thumbnail, id }: IHotItem) => (
            <WrapItem key={id}>
              {thumbnail?.value && (
                <Image
                  boxSize={["95px", "120px", "150px"]}
                  objectFit="contain"
                  src={thumbnail.value}
                />
              )}
            </WrapItem>
          ))}
      </Wrap>
    </Container>
  </Box>
);

export default HotGames;
