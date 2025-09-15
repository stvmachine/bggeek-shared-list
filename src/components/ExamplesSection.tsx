import { Badge, Box, Code, HStack, Text, VStack } from "@chakra-ui/react";
import React from "react";

const ExamplesSection: React.FC = () => {
  return (
    <Box
      bg="white"
      p={6}
      borderRadius="xl"
      boxShadow="lg"
      border="1px"
      borderColor="gray.200"
      w="full"
    >
      <VStack gap={4} w="full">
        <Text
          fontSize="md"
          color="gray.700"
          textAlign="center"
          fontWeight="semibold"
        >
          How to get started:
        </Text>
        <VStack gap={3} fontSize="sm" color="gray.600" w="full">
          <HStack gap={2} align="start" w="full">
            <Badge colorScheme="blue" variant="subtle" minW="fit-content">
              Group
            </Badge>
            <Text>
              Add multiple usernames like{" "}
              <Code colorScheme="blue" variant="subtle">
                alex_gamer, sarah_boardgames, mike_collector
              </Code>
            </Text>
          </HStack>
          <HStack gap={2} align="start" w="full">
            <Badge colorScheme="green" variant="subtle" minW="fit-content">
              Solo
            </Badge>
            <Text>Just add your own username to explore your collection</Text>
          </HStack>
        </VStack>
      </VStack>
    </Box>
  );
};

export default ExamplesSection;
