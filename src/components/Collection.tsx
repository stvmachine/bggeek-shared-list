import React from "react";
import {
  //   Link as ChakraLink,
  //   Text,
  //   Code,
  Wrap,
  WrapItem,
  Center,
  Image,
  Box,
  Container,
  Heading,
  SimpleGrid,
  Icon,
  Text,
  Stack,
  HStack,
  VStack,
} from "@chakra-ui/react";

type CollectionProps = {
  collectionData: any;
};

type ItemType = {
  collid: string;
  image: string;
  name: {
    sortIndex: string;
    $t: string;
  };
  numplays: string;
  objectid: string;
  objectype: "thing";
  status: {
    fortrade: "0" | "1";
    lastmodified: string;
    own: "0" | "1";
    preordered: "0" | "1";
    prevowned: "0" | "1";
    want: "0" | "1";
    wanttobuy: "0" | "1";
    wanttoplay: "0" | "1";
    whishlist: "0" | "1";
  };
  subtype: "boardgame";
  thumbnail: string;
  yearpublished: string;
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
