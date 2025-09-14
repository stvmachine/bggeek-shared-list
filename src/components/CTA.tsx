import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  Box,
  Heading,
  Container,
  Text,
  VStack,
  SimpleGrid,
} from "@chakra-ui/react";
import UsernameForm from "./UsernameForm";
import ExamplesSection from "./ExamplesSection";
import { getBggUser } from "bgg-xml-api-client";

export default function CTA() {
  const router = useRouter();
  const [usernames, setUsernames] = useState<string[]>([]);
  const [isValidating, setIsValidating] = useState(false);

  const validateUsername = async (username: string): Promise<boolean> => {
    try {
      const user = await getBggUser({ name: username });
      return !!(user?.data?.id);
    } catch (error) {
      return false;
    }
  };

  const handleSearch = async () => {
    if (usernames.length === 0) {
      return;
    }

    // Validate all usernames before redirecting
    setIsValidating(true);

    try {
      const validationPromises = usernames.map(async (username) => {
        const isValid = await validateUsername(username);
        return { username, isValid };
      });

      const results = await Promise.all(validationPromises);
      const invalidUsers = results.filter(r => !r.isValid);

      if (invalidUsers.length > 0) {
        console.log(`Invalid usernames: ${invalidUsers.map(u => u.username).join(", ")}`);
        return;
      }

      // All usernames are valid, redirect
      const usernameParam = usernames.map(u => encodeURIComponent(u)).join(",");
      router.push(`/collection?usernames=${usernameParam}`);
    } catch (error) {
      console.error("Error validating usernames:", error);
    } finally {
      setIsValidating(false);
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
          <VStack spacing={6} w="full" maxW="2xl">
            <UsernameForm
              usernames={usernames}
              onUsernamesChange={setUsernames}
              onSearch={handleSearch}
              isValidating={isValidating}
            />
            
            <ExamplesSection />
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

