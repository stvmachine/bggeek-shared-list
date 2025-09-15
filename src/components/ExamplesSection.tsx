import { Code, Text, VStack } from "@chakra-ui/react";
import React from "react";

const ExamplesSection: React.FC = () => {
  return (
    <VStack gap={4} w="full">
      <Text fontSize="sm" color="gray.600" textAlign="center" fontWeight="bold">
        Examples:
      </Text>
      <VStack gap={2} fontSize="sm" color="gray.500">
        <Text textAlign="center">
          <Text as="span" fontWeight="bold">
            Gaming Group:
          </Text>{" "}
          Add multiple usernames like <Code>alex_gamer, sarah_boardgames, mike_collector</Code>
        </Text>
        <Text textAlign="center">
          <Text as="span" fontWeight="bold">
            Solo Collector:
          </Text>{" "}
          Just add your own username to explore your collection
        </Text>
      </VStack>
    </VStack>
  );
};

export default ExamplesSection;
