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
  thumbnail: string;
};

const Collection = ({ collectionData }: CollectionProps) => {
  return (
    <Box p={4}>
      <Stack spacing={4} as={Container} maxW={"3xl"} textAlign={"center"}>
        <Heading fontSize={"3xl"}>Have a shared collection with your friends</Heading>
        <Text color={"gray.600"} fontSize={"xl"}>
        Check easily any game from your community.
        </Text>
      </Stack>

      <Container maxW={"6xl"} mt={10}>
        <Wrap>
          {collectionData.totalitems > 0 &&
            collectionData.item.slice(0,24).map(({ thumbnail }: ItemType) => (
              <WrapItem>
                <Image boxSize="100px" objectFit="contain" src={thumbnail} />
              </WrapItem>
            ))}
        </Wrap>
      </Container>
    </Box>
  );
};

export default Collection;
