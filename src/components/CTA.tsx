import { Box, Container, Heading, Text, VStack } from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { generatePermalink } from "../utils/permalink";
import ExamplesSection from "./ExamplesSection";
import FeaturesSection from "./FeaturesSection";
import UsernameForm from "./UsernameForm";

export default function CTA() {
  const router = useRouter();
  const [isValidating, setIsValidating] = useState(false);

  const handleSearch = async (usernames: string[]) => {
    // This is called when usernames are submitted for validation
    // Don't proceed yet - wait for validation
    console.log("UsernameForm submitted usernames for validation:", usernames);
  };

  const handleValidatedUsernames = async (usernames: string[]) => {
    if (usernames.length === 0) {
      return;
    }

    // Usernames are now validated, so we can proceed
    setIsValidating(true);

    try {
      const permalink = generatePermalink(usernames);

      // Use window.location for more reliable navigation
      if (typeof window !== "undefined") {
        window.location.href = permalink;
      } else {
        router.push(permalink);
      }
    } finally {
      setIsValidating(false);
    }
  };

  const bgGradient = "linear(to-br, blue.50, purple.50)";

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Box
        bgGradient={bgGradient}
        minH="100vh"
        display="flex"
        flexDirection="column"
      >
        <Container maxW="6xl" flex="1" display="flex" flexDirection="column">
          <VStack gap={12} py={{ base: 20, md: 36 }} flex="1">
            {/* Header Section */}
            <VStack gap={6} textAlign="center">
              <Heading
                fontWeight={700}
                fontSize={{ base: "4xl", sm: "5xl", md: "6xl" }}
                lineHeight="110%"
                bgGradient="linear(to-r, blue.600, purple.600)"
                bgClip="text"
              >
                SharedGameCollection
              </Heading>
              <Text
                color="gray.600"
                fontSize={{ base: "lg", md: "xl" }}
                maxW="3xl"
                lineHeight="1.6"
              >
                Organize and explore your group's board game collections from{" "}
                <Text as="span" color="blue.500" fontWeight="semibold">
                  BoardGameGeek.com
                </Text>
                . Perfect for gaming groups with multiple collectors. Enter a
                username to get started!
              </Text>
            </VStack>

            {/* Username Input */}
            <VStack gap={8} w="full" maxW="2xl">
              <UsernameForm
                onSearch={handleSearch}
                onValidatedUsernames={handleValidatedUsernames}
                isValidating={isValidating}
              />

              <ExamplesSection />
            </VStack>

            <FeaturesSection />
          </VStack>
        </Container>
      </Box>
    </>
  );
}
