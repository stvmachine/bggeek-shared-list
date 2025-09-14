import React from "react";
import {
  VStack,
  Heading,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";

const FeaturesSection: React.FC = () => {
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
    <VStack spacing={8} w="full">
      <Heading size="lg" textAlign="center">
        Features
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} w="full">
        {features.map((feature, index) => (
          <VStack key={index} spacing={3} textAlign="center">
            <Text fontSize="3xl">{feature.icon}</Text>
            <Heading size="md">{feature.title}</Heading>
            <Text color="gray.600" fontSize="sm">
              {feature.description}
            </Text>
          </VStack>
        ))}
      </SimpleGrid>
    </VStack>
  );
};

export default FeaturesSection;
