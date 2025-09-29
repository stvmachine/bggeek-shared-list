import { Box, Text, VStack, HStack, Icon, Button, Spinner } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaUsers, FaClock, FaGamepad } from "react-icons/fa";

interface GameNightSessionProps {
  sessionId: string;
}

interface SessionData {
  usernames: string[];
  sessionDuration: string;
  numberOfGames: string;
  sortMethod: string;
  filters: any;
  metadata: {
    createdAt: string;
    views: number;
  };
}

const GameNightSessionPage: React.FC<GameNightSessionProps> = ({ sessionId }) => {
  const router = useRouter();
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load session data and regenerate the game night
    const fetchSession = async () => {
      try {
        // Get session parameters
        const response = await fetch(`/api/collections/${sessionId}`);
        if (!response.ok) {
          throw new Error('Session not found');
        }
        
        const data = await response.json();
        if (!data.success) {
          throw new Error('Failed to load session');
        }

        setSessionData(data.session);

        // TODO: Here you would:
        // 1. Fetch collections from BGG using the usernames
        // 2. Apply the same filters and sorting
        // 3. Generate the same game night collection
        // 4. Display the results

        // For now, show a message that this would regenerate the game night

      } catch (error) {
        console.error('Error fetching session:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  if (loading) {
    return (
      <Box minH="100vh" bg="gray.900" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Spinner size="xl" color="cyan.400" />
          <Text color="white">Loading game night session...</Text>
        </VStack>
      </Box>
    );
  }

  if (!sessionData) {
    return (
      <Box minH="100vh" bg="gray.900" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Text fontSize="2xl" color="white">Game night session not found</Text>
          <Button onClick={() => router.push('/game-night')}>
            Go to Game Night Planner
          </Button>
        </VStack>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.900" py={8}>
      <Box maxW="1200px" mx="auto" px={4}>
        {/* Header */}
        <VStack spacing={4} mb={8}>
          <Text
            fontSize="4xl"
            fontWeight="bold"
            color="cyan.400"
            textAlign="center"
            textShadow="0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff"
            fontFamily="mono"
            letterSpacing="2px"
          >
            🎮 GAME NIGHT SESSION 🎮
          </Text>
          <Text
            fontSize="xl"
            color="pink.400"
            textAlign="center"
            textShadow="0 0 5px #ff00ff"
            fontFamily="mono"
            letterSpacing="1px"
          >
            {sessionData.usernames.join(', ')}'s Game Night
          </Text>
          <Text
            fontSize="lg"
            color="gray.300"
            textAlign="center"
            fontFamily="mono"
            letterSpacing="1px"
          >
            Session: {sessionData.sessionDuration} • {sessionData.numberOfGames} games • {sessionData.sortMethod === "random" ? "Randomized" : sessionData.sortMethod === "rating" ? "Top Rated" : "Time Optimized"}
          </Text>
        </VStack>

        {/* Session Info */}
        <Box
          bg="linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)"
          borderRadius="2xl"
          p={8}
          mb={6}
          position="relative"
          overflow="hidden"
        >
          <VStack spacing={6}>
            <Text fontSize="lg" color="white" textAlign="center">
              This game night session would regenerate the same collection with current BGG data:
            </Text>
            
            <HStack justify="space-around" wrap="wrap" spacing={4}>
              <VStack spacing={1}>
                <Icon as={FaUsers} color="#00ffff" boxSize="20px" />
                <Text fontSize="sm" color="cyan.300" fontFamily="mono">
                  PLAYERS
                </Text>
                <Text fontSize="lg" color="white" fontWeight="bold">
                  {sessionData.usernames.length}
                </Text>
              </VStack>
              
              <VStack spacing={1}>
                <Icon as={FaClock} color="#ff00ff" boxSize="20px" />
                <Text fontSize="sm" color="pink.300" fontFamily="mono">
                  SESSION TIME
                </Text>
                <Text fontSize="lg" color="white" fontWeight="bold">
                  {sessionData.sessionDuration.toUpperCase()}
                </Text>
              </VStack>
              
              <VStack spacing={1}>
                <Icon as={FaGamepad} color="#00ff00" boxSize="20px" />
                <Text fontSize="sm" color="green.300" fontFamily="mono">
                  GAMES
                </Text>
                <Text fontSize="lg" color="white" fontWeight="bold">
                  {sessionData.numberOfGames}
                </Text>
              </VStack>
            </HStack>

            <Text fontSize="sm" color="gray.400" textAlign="center">
              Session created: {new Date(sessionData.metadata.createdAt).toLocaleDateString()}
            </Text>
          </VStack>
        </Box>

        {/* Action Buttons */}
        <VStack spacing={4}>
          <Button
            onClick={() => router.push('/game-night')}
            bg="linear-gradient(45deg, #ff00ff, #00ffff)"
            color="black"
            fontWeight="bold"
            fontSize="lg"
            px={8}
            py={4}
            borderRadius="full"
            border="2px solid"
            borderColor="white"
            _hover={{
              transform: "scale(1.05)",
              boxShadow: "0 0 20px rgba(255, 0, 255, 0.5), 0 0 40px rgba(0, 255, 255, 0.5)",
            }}
            transition="all 0.2s"
            fontFamily="mono"
            letterSpacing="1px"
          >
            🎲 Recreate This Game Night
          </Button>
          
          <Text fontSize="sm" color="gray.400" textAlign="center">
            Session ID: {sessionId}
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { id } = params as { id: string };
  
  return {
    props: {
      sessionId: id,
    },
  };
};

export default GameNightSessionPage;
