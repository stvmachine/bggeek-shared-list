import { Box, Container, Flex, Heading, Image, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { FaGamepad, FaSearch, FaUserFriends } from "react-icons/fa";

import { generatePermalink } from "../utils/permalink";
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

  // Colors from the screenshot
  const bgColor = "#fdf2f8"; // Light pink background
  const textColor = "#1f2937"; // Dark gray/black for main heading
  const mutedTextColor = "#6b7280"; // Gray for subtitle text

  return (
    <Box
      bg={bgColor}
      minH={{ base: "auto", md: "100vh" }}
      display="flex"
      alignItems="center"
      color={textColor}
      position="relative"
      overflow="hidden"
      py={{ base: 8, md: 16 }}
      px={{ base: 4, md: 8 }}
    >
      <Container maxW="container.xl" px={{ base: 4, md: 8 }} h="100%">
        <Flex
          direction={{ base: "column", lg: "row" }}
          alignItems="center"
          justifyContent="space-between"
          gap={{ base: 6, md: 8, lg: 12 }}
          h="100%"
          position="relative"
          maxW="7xl"
          mx="auto"
          w="100%"
        >
          {/* Content - Takes full width on mobile, 50% on larger screens */}
          <Box
            flex={{ base: "1 0 100%", lg: "0 0 45%" }}
            alignSelf="center"
            pt={{ base: 4, lg: 12 }}
            order={{ base: 1, lg: 1 }}
          >
            <Heading
              as="h1"
              fontSize={{ base: "2xl", sm: "3xl", md: "4xl", lg: "5xl" }}
              fontWeight="bold"
              mb={{ base: 4, md: 6 }}
              lineHeight="1.2"
            >
              Discover, Organize, and Share Your Board Game Collection
            </Heading>

            <Text
              fontSize={{ base: "md", md: "lg" }}
              color={mutedTextColor}
              mb={{ base: 6, md: 8 }}
              lineHeight="1.7"
              maxW="600px"
            >
              Connect with your friends' BoardGameGeek collections to find games
              everyone will love. Perfect for game nights and building your next
              favorite collection.
            </Text>

            {/* Search Form - Moved below text on mobile, next to image on desktop */}
            <Box
              w="100%"
              maxW={{ base: "100%", lg: "90%" }}
              mt={{ base: 6, lg: 0 }}
            >
              <UsernameForm
                onSearch={handleSearch}
                onValidatedUsernames={handleValidatedUsernames}
                isValidating={isValidating}
              />
            </Box>
          </Box>

          {/* Right Column - Image */}
          <Box
            flex={{ base: "1 0 100%", lg: "0 0 50%" }}
            display="flex"
            justifyContent="center"
            alignItems="center"
            order={{ base: 2, lg: 2 }}
            position="relative"
            mt={{ base: 4, lg: 0 }}
          >
            <Box
              position="relative"
              w="100%"
              maxW={{ base: "400px", md: "500px", lg: "600px" }}
              mx="auto"
            >
              <Box
                position="relative"
                overflow="hidden"
                rounded={{ base: "md", md: "lg" }}
                shadow={{ base: "md", md: "xl" }}
                border="1px solid"
                borderColor="gray.200"
                transition="all 0.3s ease-in-out"
                _hover={{
                  transform: { base: "none", md: "scale(1.02)" },
                  boxShadow: { base: "md", md: "2xl" },
                }}
              >
                <Image
                  src="/img/hero.png"
                  alt="Board Game Collection"
                  width="100%"
                  height="auto"
                  objectFit="contain"
                />
              </Box>
            </Box>
          </Box>
        </Flex>

        {/* How to Get Started Section */}
        <Box
          mt={{ base: 12, md: 16, lg: 24 }}
          textAlign="center"
          px={{ base: 2, md: 8 }}
        >
          <Box
            as="span"
            display="inline-block"
            bgGradient="linear(to-r, blue.500, purple.500)"
            bgClip="text"
            fontSize={{ base: "sm", md: "md" }}
            fontWeight="semibold"
            letterSpacing="wider"
            textTransform="uppercase"
            mb={3}
          >
            Get Started in 3 Simple Steps
          </Box>

          <Heading
            size={{ base: "2xl", md: "3xl", lg: "4xl" }}
            mb={{ base: 8, md: 12 }}
            fontWeight="bold"
            lineHeight="1.2"
            maxW="2xl"
            mx="auto"
            color={textColor}
          >
            How to Find Your Next Game Night Favorite
          </Heading>

          <Flex
            direction={{ base: "column", md: "row" }}
            gap={{ base: 4, md: 6, lg: 8 }}
            justify="center"
            maxW="7xl"
            mx="auto"
            px={{ base: 2, md: 6 }}
          >
            {[
              {
                icon: FaUserFriends,
                title: "1. Add Friends",
                description:
                  "Enter your friends' BoardGameGeek usernames to see their collections",
                color: "blue.500",
                bgGradient: "linear(to-br, blue.50, blue.100)",
              },
              {
                icon: FaSearch,
                title: "2. Discover Matches",
                description:
                  "Instantly find games that everyone owns or wants to play",
                color: "purple.500",
                bgGradient: "linear(to-br, purple.50, purple.100)",
              },
              {
                icon: FaGamepad,
                title: "3. Play & Enjoy",
                description:
                  "Start your game night with the perfect game for your group",
                color: "green.500",
                bgGradient: "linear(to-br, green.50, green.100)",
              },
            ].map((step, index) => (
              <Box
                key={index}
                bg="white"
                p={{ base: 5, md: 6, lg: 8 }}
                borderRadius={{ base: "lg", md: "xl" }}
                boxShadow={{ base: "md", md: "xl" }}
                flex="1"
                minW={{ base: "full", md: "280px" }}
                maxW={{ base: "100%", md: "320px" }}
                borderTop={{ base: "3px solid", md: "4px solid" }}
                borderTopColor={step.color}
                border="1px solid"
                borderColor="gray.200"
                transition="all 0.2s ease-in-out"
                _hover={{
                  transform: { base: "none", md: "translateY(-2px)" },
                  boxShadow: { base: "md", md: "2xl" },
                }}
                position="relative"
                overflow="hidden"
                _before={{
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "3px",
                  background: `linear-gradient(90deg, ${step.color}, ${step.color}88)`,
                  opacity: 0.8,
                }}
              >
                <Flex
                  direction={{ base: "column", sm: "row" }}
                  align={{ base: "center", sm: "flex-start" }}
                  gap={{ base: 4, sm: 5 }}
                  mb={0}
                >
                  <Box
                    p={{ base: 3, md: 4 }}
                    bgGradient={step.bgGradient}
                    rounded={{ base: "xl", md: "2xl" }}
                    color={step.color}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink={0}
                    width={{ base: "56px", md: "64px" }}
                    height={{ base: "56px", md: "64px" }}
                    boxShadow="sm"
                    border="1px solid"
                    borderColor={`${step.color}20`}
                  >
                    <Box
                      as={step.icon}
                      boxSize={{ base: "28px", md: "32px" }}
                    />
                  </Box>
                  <Box flex="1" textAlign={{ base: "center", sm: "left" }}>
                    <Text
                      color={textColor}
                      fontSize={{ base: "lg", md: "xl" }}
                      fontWeight="bold"
                      lineHeight="shorter"
                      mb={{ base: 2, md: 3 }}
                    >
                      {step.title}
                    </Text>
                    <Text
                      color={mutedTextColor}
                      fontSize={{ base: "sm", md: "md" }}
                      lineHeight={{ base: "1.5", md: "1.6" }}
                    >
                      {step.description}
                    </Text>
                  </Box>
                </Flex>
              </Box>
            ))}
          </Flex>
        </Box>
      </Container>
    </Box>
  );
}
