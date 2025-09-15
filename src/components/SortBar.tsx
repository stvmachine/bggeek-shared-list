import { Box, HStack } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

const SortBar = () => {
  const { register } = useFormContext();

  return (
    <Box id="orderBy-wrapper" my={4}>
      <HStack justifyContent="flex-start" alignItems="center">
        <Box fontSize="md" fontWeight="bold">
          Sort:{" "}
        </Box>
        <Box
          as="select"
          {...register("orderBy")}
          width="xxs"
          p={2}
          border="1px solid"
          borderColor="gray.300"
          borderRadius="md"
          bg="white"
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
      </HStack>
    </Box>
  );
};

export default SortBar;
