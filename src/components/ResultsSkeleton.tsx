import { Box, Skeleton, VStack, HStack } from "@chakra-ui/react";
import React from "react";

const ResultsSkeleton = () => {
  return (
    <Box flex="1" p={{ base: 2, md: 4 }}>
      <VStack spacing={4} align="stretch">
        {/* Header skeleton */}
        <Box>
          <Skeleton height="40px" borderRadius="lg" />
        </Box>

        {/* Sort bar skeleton */}
        <Box>
          <HStack spacing={2}>
            <Skeleton height="32px" width="120px" borderRadius="md" />
            <Skeleton height="32px" width="100px" borderRadius="md" />
            <Skeleton height="32px" width="80px" borderRadius="md" />
          </HStack>
        </Box>

        {/* Game cards skeleton */}
        <VStack spacing={3} align="stretch">
          {Array.from({ length: 6 }).map((_, index) => {
            const widths = ["70%", "60%", "80%", "50%", "75%", "65%"];
            const tagWidths = [
              ["60px", "80px", "50px"],
              ["70px", "60px", "90px"],
              ["50px", "70px", "60px"],
              ["80px", "50px", "70px"],
              ["60px", "90px", "55px"],
              ["75px", "65px", "45px"],
            ];

            return (
              <Box
                key={index}
                border="1px solid"
                borderColor="gray.200"
                borderRadius="lg"
                p={4}
                bg="white"
              >
                <HStack spacing={4} align="start">
                  {/* Game image skeleton */}
                  <Skeleton
                    width="80px"
                    height="80px"
                    borderRadius="md"
                    flexShrink={0}
                  />

                  {/* Game info skeleton */}
                  <VStack spacing={2} align="start" flex="1">
                    <Skeleton height="20px" width={widths[index]} />
                    <Skeleton height="16px" width="50%" />
                    <Skeleton height="16px" width="40%" />

                    {/* Tags skeleton */}
                    <HStack spacing={2}>
                      {tagWidths[index].map((width, tagIndex) => (
                        <Skeleton
                          key={tagIndex}
                          height="24px"
                          width={width}
                          borderRadius="full"
                        />
                      ))}
                    </HStack>
                  </VStack>
                </HStack>
              </Box>
            );
          })}
        </VStack>
      </VStack>
    </Box>
  );
};

export default ResultsSkeleton;
