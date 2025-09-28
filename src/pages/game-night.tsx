import { Box, Button, Container, Heading, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { useQueries } from "react-query";

import { mergeCollections } from "../api/fetchGroupCollection";
import GameNightPlanner from "../components/GameNightPlanner";
import Footer from "../components/Layout/Footer";
import Navbar from "../components/Layout/Navbar";
import { MemberProvider } from "../contexts/MemberContext";
import { parseUsernamesFromUrl } from "../utils/permalink";
import { ICollection } from "../utils/types";

type GameNightPageProps = {
  initialData?: ICollection[];
};

export async function getStaticProps() {
  return {
    props: {},
  };
}

const GameNightPage: NextPage<GameNightPageProps> = () => {
  const router = useRouter();
  const { usernames: urlUsernames, username } = router.query;

  // Parse usernames from URL - handle both usernames and username parameters
  const members = useMemo(() => {
    if (urlUsernames) {
      return parseUsernamesFromUrl(urlUsernames);
    }
    if (username) {
      return parseUsernamesFromUrl(username);
    }
    return [];
  }, [urlUsernames, username]);

  // Fetch collections for all members
  const results = useQueries(
    members.map(member => ({
      queryKey: ["collection", member],
      queryFn: async () => {
        const response = await fetch(
          `/api/collection?username=${encodeURIComponent(member)}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      },
      refetchOnWindowFocus: false,
    }))
  );

  const rawData = useMemo(() => {
    const isLoading = results.reduce(
      (acc, next) => next.isLoading || acc,
      false
    );
    if (isLoading) return undefined;

    const dataArray = results
      .map((result: any) => result?.data)
      .filter(Boolean);

    if (dataArray.length === 0) return undefined;

    const merged = mergeCollections(dataArray, members);
    return merged;
  }, [results, members]);

  const isLoading = useMemo(
    () => results.reduce((acc, next) => next.isLoading || acc, false),
    [results]
  );

  const data = rawData;

  return (
    <MemberProvider usernames={members}>
      <Box minH="100vh" display="flex" flexDirection="column">
        <Navbar />
        <Container maxW="container.xl" flex="1" py={8} px={{ base: 0, md: 4 }}>
          {isLoading ? (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              minH="400px"
            >
              <Text fontSize="lg" color="gray.500">
                Loading collections...
              </Text>
            </Box>
          ) : members.length === 0 ? (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              minH="400px"
              textAlign="center"
            >
              <Box maxW="md">
                <Heading fontSize="xl" color="gray.600" mb={4}>
                  🎲 Ready to Plan Your Game Night?
                </Heading>
                <Text fontSize="md" color="gray.500" mb={6}>
                  Add some BoardGameGeek usernames to get personalized game
                  recommendations for your group!
                </Text>
                <Button
                  colorScheme="blue"
                  size="lg"
                  onClick={() => router.push({
                    pathname: "/collection",
                    query: router.query,
                  })}
                >
                  Go to Collections
                </Button>
              </Box>
            </Box>
          ) : data && data.boardgames ? (
            <GameNightPlanner games={data.boardgames} />
          ) : (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              minH="400px"
            >
              <Text fontSize="lg" color="gray.500">
                No games found in collections
              </Text>
            </Box>
          )}
        </Container>
        <Footer />
      </Box>
    </MemberProvider>
  );
};

export default GameNightPage;
