import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

const SortBar = () => {
  const { register } = useFormContext();

  return (
    <Box 
      border="1px solid" 
      borderColor="gray.200" 
      borderRadius="lg" 
      p={4} 
      mb={6}
      bg="white"
    >
      <VStack gap={4} align="stretch">
        <Text fontSize="lg" fontWeight="bold" color="gray.700">
          🔧 Sort & Group
        </Text>
        
        <HStack gap={6} flexWrap="wrap" align="flex-start">
          <VStack align="stretch" gap={2} minWidth="200px">
            <Text fontSize="sm" fontWeight="medium" color="gray.600">
              Sort by
            </Text>
            <Box
              as="select"
              {...register("orderBy")}
              width="100%"
              p={3}
              border="1px solid"
              borderColor="gray.300"
              borderRadius="lg"
              bg="white"
              fontSize="sm"
              _focus={{
                borderColor: "blue.400",
                boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)"
              }}
            >
              <option value="name_asc" key="order_by_name_asc">
                Name: A-Z
              </option>
              <option value="name_desc" key="order_by_name_desc">
                Name: Z-A
              </option>
              <option value="rating_asc" key="order_by_rating_asc">
                Rating: Lowest first
              </option>
              <option value="rating_desc" key="order_by_rating_desc">
                Rating: Highest first
              </option>
              <option value="year_asc" key="order_by_year_asc">
                Year: Oldest first
              </option>
              <option value="year_desc" key="order_by_year_desc">
                Year: Newest first
              </option>
            </Box>
          </VStack>

          <VStack align="stretch" gap={2} minWidth="200px">
            <Text fontSize="sm" fontWeight="medium" color="gray.600">
              Group by
            </Text>
            <Box
              as="select"
              {...register("groupBy")}
              width="100%"
              p={3}
              border="1px solid"
              borderColor="gray.300"
              borderRadius="lg"
              bg="white"
              fontSize="sm"
              _focus={{
                borderColor: "blue.400",
                boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)"
              }}
            >
              <option value="none" key="group_by_none">
                None
              </option>
              <option value="players" key="group_by_players">
                Number of Players
              </option>
              <option value="rating" key="group_by_rating">
                Rating Range
              </option>
              <option value="bestPlayers" key="group_by_best_players">
                Best with X Players
              </option>
              <option value="categories" key="group_by_categories">
                Categories
              </option>
              <option value="mechanics" key="group_by_mechanics">
                Mechanics
              </option>
              <option value="families" key="group_by_families">
                Families
              </option>
              <option value="publishers" key="group_by_publishers">
                Publishers
              </option>
              <option value="artists" key="group_by_artists">
                Artists
              </option>
              <option value="designers" key="group_by_designers">
                Designers
              </option>
              <option value="compilations" key="group_by_compilations">
                Compilations
              </option>
            </Box>
          </VStack>
        </HStack>
      </VStack>
    </Box>
  );
};

export default SortBar;
