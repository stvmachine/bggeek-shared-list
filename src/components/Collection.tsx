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
import { ItemType } from "../utils/types";
import { BggCollectionResponse } from "bgg-xml-api-client";

type CollectionProps = {
  collectionData: BggCollectionResponse;
};

const Collection = ({ collectionData }: CollectionProps) => (
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
        {collectionData.totalitems > 0 &&
          collectionData.item.map(({ thumbnail, objectid }: ItemType) => (
            <WrapItem key={objectid}>
              <Image boxSize="150px" objectFit="contain" src={thumbnail} />
            </WrapItem>
          ))}
      </Wrap>
    </Container>
  </Box>
);

export default Collection;
