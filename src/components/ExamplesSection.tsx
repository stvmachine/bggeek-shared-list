import React from "react";
import {
  VStack,
  Text,
  Code,
} from "@chakra-ui/react";

const ExamplesSection: React.FC = () => {
  return (
    <VStack spacing={4} w="full">
      <Text fontSize="sm" color="gray.600" textAlign="center" fontWeight="bold">
        Examples:
      </Text>
      <VStack spacing={2} fontSize="sm" color="gray.500">
        <Text textAlign="center">
          <Text as="span" fontWeight="bold">Gaming Group:</Text> Add multiple usernames like <Code>alex_gamer</Code>, <Code>sarah_boardgames</Code>, <Code>mike_collector</Code>
        </Text>
        <Text textAlign="center">
          <Text as="span" fontWeight="bold">Solo Collector:</Text> Just add your own username to explore your collection
        </Text>
      </VStack>
    </VStack>
  );
};

export default ExamplesSection;
