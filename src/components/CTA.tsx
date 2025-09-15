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
import { getBggUser } from "bgg-xml-api-client";
import { generatePermalink } from "../utils/permalink";

export default function CTA() {
  const router = useRouter();
  const [isValidating, setIsValidating] = useState(false);

  const validateUsername = async (username: string): Promise<boolean> => {
    const user = await getBggUser({ name: username }).catch(() => null);
    return !!user?.data?.id;
  };

  const handleSearch = async (usernames: string[]) => {
    if (usernames.length === 0) {
      return;
    }

    // Validate all usernames before redirecting
    setIsValidating(true);

    const validationPromises = usernames.map(async (username) => {
      const isValid = await validateUsername(username);
      return { username, isValid };
    });

    const results = await Promise.all(validationPromises);
    const invalidUsers = results.filter(r => !r.isValid);

    if (invalidUsers.length > 0) {
      console.log(`Invalid usernames: ${invalidUsers.map(u => u.username).join(", ")}`);
      setIsValidating(false);
      return;
    }

    // All usernames are valid, generate permalink and redirect
    const permalink = generatePermalink(usernames);
    
    // Use window.location for more reliable navigation
    if (typeof window !== 'undefined') {
      window.location.href = permalink;
    } else {
      router.push(permalink);
    }
    setIsValidating(false);
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

