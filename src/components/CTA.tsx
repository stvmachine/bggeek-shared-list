import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  Heading,
  Container,
  Text,
  VStack,
} from "@chakra-ui/react";
import UsernameForm from "./UsernameForm";
import ExamplesSection from "./ExamplesSection";
import FeaturesSection from "./FeaturesSection";
import { generatePermalink } from "../utils/permalink";

export default function CTA() {
  const router = useRouter();
  const [isValidating, setIsValidating] = useState(false);

  const handleSearch = async (usernames: string[]) => {
    // This is called when usernames are submitted for validation
    // Don't proceed yet - wait for validation
    console.log('UsernameForm submitted usernames for validation:', usernames);
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
      if (typeof window !== 'undefined') {
        window.location.href = permalink;
      } else {
        router.push(permalink);
      }
    } finally {
      setIsValidating(false);
    }
  };


  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Container maxW={"6xl"}>
        <VStack gap={12} py={{ base: 20, md: 36 }}>
          {/* Header Section */}
          <VStack gap={6} textAlign="center">
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
          <VStack gap={6} w="full" maxW="2xl">
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
    </>
  );
}

