import {
  Box,
  Container,
  Heading,
  Image,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { BggHotResponse } from "bgg-xml-api-client";

type HotGamesProps = {
  collectionData: BggHotResponse;
};

const HotGames = ({ collectionData }: HotGamesProps) => {
  const bgGradient = "linear(to-br, blue.50, purple.50)";

  return (
    <Box bgGradient={bgGradient} py={16}>
      <Container maxW="6xl">
        <VStack gap={8} textAlign="center" mb={12}>
          <Heading
            fontSize={{ base: "3xl", md: "4xl" }}
            fontWeight="700"
            color="gray.800"
          >
            Have a shared collection with your friends
          </Heading>
          <Text
            color="gray.600"
            fontSize={{ base: "lg", md: "xl" }}
            maxW="2xl"
            lineHeight="1.6"
          >
            Check easily any game from your community and discover new favorites
            together.
          </Text>
        </VStack>

        <Wrap gap={4} justify="center">
          {collectionData?.item &&
            collectionData.item.length > 0 &&
            collectionData.item.map(({ thumbnail, id }: any) => (
              <WrapItem key={id}>
                {thumbnail?.value && (
                  <Box
                    borderRadius="lg"
                    overflow="hidden"
                    boxShadow="lg"
                    _hover={{
                      transform: "scale(1.05)",
                      transition: "transform 0.2s",
                    }}
                    transition="transform 0.2s"
                  >
                    <Image
                      boxSize={["100px", "120px", "140px"]}
                      objectFit="cover"
                      src={thumbnail.value}
                      alt="Board game thumbnail"
                    />
                  </Box>
                )}
              </WrapItem>
            ))}
        </Wrap>
      </Container>
    </Box>
  );
};

export default HotGames;
