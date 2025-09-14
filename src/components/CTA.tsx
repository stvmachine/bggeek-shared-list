import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  Box,
  Heading,
  Container,
  Text,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  HStack,
  VStack,
  SimpleGrid,
} from "@chakra-ui/react";
import { SearchIcon, InfoIcon } from "@chakra-ui/icons";

export default function CTA() {
  const router = useRouter();
  const [username, setUsername] = useState("");

  const handleSearch = () => {
    if (username.trim()) {
      router.push(`/collection?username=${encodeURIComponent(username.trim())}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const features = [
    {
      icon: "👥",
      title: "Group Collections",
      description: "Combine multiple collectors' BoardGameGeek collections into one shared view"
    },
    {
      icon: "🔍",
      title: "Smart Filtering",
      description: "Find games that work for your group size, complexity, and time constraints"
    },
    {
      icon: "🎲",
      title: "Random Selection",
      description: "Let the dice decide! Pick random games from your group's combined collection"
    },
    {
      icon: "📊",
      title: "Collection Analytics",
      description: "See which collector has the most games, favorite designers, and collection stats"
    },
    {
      icon: "📚",
      title: "Organize by Owner",
      description: "Filter games by who owns them, perfect for planning game nights"
    },
    {
      icon: "💰",
      title: "Group Value Tracking",
      description: "See the total value of your group's combined collection"
    }
  ];

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Container maxW={"6xl"}>
        <VStack spacing={12} py={{ base: 20, md: 36 }}>
          {/* Header Section */}
          <VStack spacing={6} textAlign="center">
            <Heading
              fontWeight={600}
              fontSize={{ base: "3xl", sm: "4xl", md: "5xl" }}
              lineHeight={"110%"}
            >
              SharedGameCollection
            </Heading>
            <Text color={"gray.500"} fontSize="lg" maxW="2xl">
              Organize and explore your group's board game collections from{" "}
              <Text as="span" color="blue.500" textDecoration="underline">
                BoardGameGeek.com
              </Text>
              . Perfect for gaming groups with multiple collectors. Enter a username to get started!
            </Text>
          </VStack>

          {/* Username Input */}
          <VStack spacing={4} w="full" maxW="md">
            <Box w="full">
              <InputGroup size="lg">
                <Input
                  placeholder="BoardGameGeek Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={handleKeyPress}
                  bg="gray.100"
                  border="none"
                  _focus={{
                    bg: "gray.200",
                    boxShadow: "none"
                  }}
                />
                <InputRightElement>
                  <HStack spacing={2}>
                    <IconButton
                      aria-label="Info"
                      icon={<InfoIcon />}
                      size="sm"
                      variant="ghost"
                    />
                    <IconButton
                      aria-label="Search"
                      icon={<SearchIcon />}
                      size="sm"
                      colorScheme="blue"
                      onClick={handleSearch}
                    />
                  </HStack>
                </InputRightElement>
              </InputGroup>
            </Box>
            
            {/* Group vs Individual Options */}
            <VStack spacing={3} w="full">
              <Text fontSize="sm" color="gray.600" textAlign="center">
                <Text as="span" fontWeight="bold">Gaming Group?</Text> Add multiple usernames to combine collections
              </Text>
              <Text fontSize="sm" color="gray.500" textAlign="center">
                <Text as="span" fontWeight="bold">Solo Collector?</Text> We'll help you organize and explore your single collection
              </Text>
            </VStack>
          </VStack>

          {/* Features Section */}
          <VStack spacing={8} w="full">
            <Heading size="lg" textAlign="center">
              Features
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} w="full">
              {features.map((feature, index) => (
                <VStack key={index} spacing={3} textAlign="center">
                  <Box fontSize="3xl">{feature.icon}</Box>
                  <Heading size="md">{feature.title}</Heading>
                  <Text color="gray.600" fontSize="sm">
                    {feature.description}
                  </Text>
                </VStack>
              ))}
            </SimpleGrid>
          </VStack>
        </VStack>
      </Container>
    </>
  );
}

