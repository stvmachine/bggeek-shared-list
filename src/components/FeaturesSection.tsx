import { Heading, SimpleGrid, Text, VStack, Box, Icon } from "@chakra-ui/react";
import React from "react";

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: "👥",
      title: "Group Collections",
      description:
        "Combine multiple collectors' BoardGameGeek collections into one shared view",
    },
    {
      icon: "🔍",
      title: "Smart Filtering",
      description:
        "Find games that work for your group size, complexity, and time constraints",
    },
    {
      icon: "🎲",
      title: "Random Selection",
      description:
        "Let the dice decide! Pick random games from your group's combined collection",
    },
    {
      icon: "📊",
      title: "Collection Analytics",
      description:
        "See which collector has the most games, favorite designers, and collection stats",
    },
    {
      icon: "📚",
      title: "Organize by Owner",
      description:
        "Filter games by who owns them, perfect for planning game nights",
    },
    {
      icon: "💰",
      title: "Group Value Tracking",
      description: "See the total value of your group's combined collection",
    },
  ];

  return (
    <VStack gap={12} w="full" py={8}>
      <Heading size="xl" textAlign="center" color="gray.700">
        Features
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={8} w="full">
        {features.map((feature, index) => (
          <Box
            key={index}
            bg="white"
            p={6}
            borderRadius="xl"
            boxShadow="lg"
            border="1px"
            borderColor="gray.200"
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: "xl",
              transition: "all 0.2s",
            }}
            transition="all 0.2s"
          >
            <VStack gap={4} textAlign="center" h="full">
              <Box
                fontSize="4xl"
                p={3}
                bg="blue.50"
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
                w="80px"
                h="80px"
              >
                {feature.icon}
              </Box>
              <Heading size="md" color="gray.800">
                {feature.title}
              </Heading>
              <Text color="gray.600" fontSize="sm" lineHeight="1.6">
                {feature.description}
              </Text>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    </VStack>
  );
};

export default FeaturesSection;
