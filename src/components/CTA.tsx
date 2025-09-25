import { Box, Container, Heading, Text, Flex, Image, Icon } from "@chakra-ui/react";
import { FaUserFriends, FaSearch, FaGamepad } from "react-icons/fa";
import { useRouter } from "next/router";
import { useState } from "react";

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
  const accentColor = "#9d174d"; // Dark pink accent
  const mutedTextColor = "#6b7280"; // Gray for subtitle text

  return (
    <Box
      bg={bgColor}
      minH="100vh"
      display="flex"
      alignItems="center"
      color={textColor}
      position="relative"
      overflow="hidden"
      py={16}
      px={{ base: 4, md: 8 }}
    >
      <Container maxW="container.xl" px={8}>
        <Flex
          direction={{ base: 'row', lg: 'row' }}
          alignItems="center"
          justifyContent="space-between"
          gap={{ base: 4, lg: 12 }}
          flexWrap={{ base: 'wrap', lg: 'nowrap' }}
        >
          {/* Content - Takes full width on mobile, 50% on larger screens */}
          <Box flex={{ base: '1 0 100%', sm: '1 0 55%', lg: '0 0 50%' }}>
            <Flex direction="column" align={{ base: 'center', sm: 'flex-start' }} mb={6}>
              <Text
                color={accentColor}
                fontSize="sm"
                fontWeight="semibold"
                letterSpacing="wide"
                textTransform="uppercase"
                opacity={0.9}
                mt={2}
              >
                Collection Manager
              </Text>
            </Flex>
            
            <Heading
              as="h1"
              fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
              fontWeight="bold"
              lineHeight="1.2"
              mb={6}
            >
              Discover, Organize, and Share Your Board Game Collection
            </Heading>
            
            <Text
              fontSize="lg"
              color={mutedTextColor}
              mb={8}
              lineHeight="1.7"
              maxW="600px"
            >
              Connect with your friends' BoardGameGeek collections to find games everyone will love.
              Perfect for game nights and building your next favorite collection.
            </Text>

            {/* Search Form */}
            <Box mb={8}>
              <UsernameForm
                onSearch={handleSearch}
                onValidatedUsernames={handleValidatedUsernames}
                isValidating={isValidating}
              />
            </Box>

          </Box>

          {/* Right Column - Image - 40% width on mobile, 50% on larger screens */}
          <Box 
            flex={{ base: '1 0 40%', lg: '1' }}
            display="flex"
            justifyContent="center"
            order={{ base: -1, lg: 1 }}
            mb={{ base: 6, lg: 0 }}
          >
            <Image 
              src="/img/hero.png" 
              alt="Board Game Collection"
              maxW="100%"
              height="auto"
              rounded="lg"
              shadow="lg"
              border="1px solid rgba(0,0,0,0.1)"
              objectFit="contain"
            />
          </Box>
        </Flex>

        {/* How to Get Started Section */}
        <Box mt={{ base: 12, md: 20 }} textAlign="center">
          <Heading size={{ base: "lg", md: "xl" }} mb={{ base: 4, md: 8 }} color={textColor}>
            How to Get Started
          </Heading>
          
          <Flex 
            direction={{ base: 'column', md: 'row' }} 
            gap={{ base: 3, md: 6, lg: 8 }} 
            justify="center"
            px={{ base: 4, md: 0 }}
          >
            {[
              {
                icon: FaUserFriends,
                title: "1. Add Friends",
                description: "Enter friends' BoardGameGeek usernames"
              },
              {
                icon: FaSearch,
                title: "2. Discover",
                description: "Find games everyone can play"
              },
              {
                icon: FaGamepad,
                title: "3. Play",
                description: "Start your game night"
              }
            ].map((step, index) => (
              <Box 
                key={index}
                bg="white"
                p={{ base: 4, md: 6 }}
                rounded="lg"
                shadow="sm"
                maxW={{ base: '100%', md: '300px' }}
                border="1px solid"
                borderColor="gray.100"
                flex="1"
                minW={{ base: 'auto', md: '200px' }}
              >
                <Flex direction="row" align="center" gap={3} mb={2}>
                  <Box p={2} bg="pink.50" rounded="full">
                    <Icon as={step.icon} w={5} h={5} color={accentColor} />
                  </Box>
                  <Heading size="sm" color={textColor} textAlign="left">
                    {step.title}
                  </Heading>
                </Flex>
                <Text color={mutedTextColor} fontSize="sm" textAlign="left">
                  {step.description}
                </Text>
              </Box>
            ))}
          </Flex>
        </Box>
      </Container>
    </Box>
  );
}
