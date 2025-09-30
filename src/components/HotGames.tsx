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
import { useHotGames } from "../hooks/useHotGames";

const HotGames = () => {
  const { data: hotGames, loading, error } = useHotGames("boardgame");
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
          {loading ? (
            <Text color="gray.500">Loading hot games...</Text>
          ) : error ? (
            <Text color="red.500">Failed to load hot games</Text>
          ) : (
            hotGames &&
            hotGames.length > 0 &&
            hotGames.slice(0, 30).map((game: any) => (
              <WrapItem key={game.id}>
                {game.thumbnail && (
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
                      src={game.thumbnail}
                      alt={`${game.name} thumbnail`}
                    />
                  </Box>
                )}
              </WrapItem>
            ))
          )}
        </Wrap>
      </Container>
    </Box>
  );
};

export default HotGames;
