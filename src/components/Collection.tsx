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

type CollectionProps = {
  collectionData: any;
};


const Collection = ({ collectionData }: CollectionProps) => {
  console.log(collectionData);
  return (
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
            collectionData.item
              .slice(0, 30)
              .map(({ thumbnail, objectid }: ItemType) => (
                <WrapItem key={objectid}>
                  <Image boxSize="100px" objectFit="contain" src={thumbnail} />
                </WrapItem>
              ))}
        </Wrap>
      </Container>
    </Box>
  );
};

export default Collection;
