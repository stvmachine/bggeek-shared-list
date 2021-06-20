import React from "react";
import { HStack, Select, FormControl, FormLabel } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

const SortBar = () => {
  const { register } = useFormContext();

  return (
    <FormControl id="orderBy-wrapper" my={4}>
      <HStack justifyContent="flex-start" alignItems="center">
        <FormLabel fontSize="md">Sort: </FormLabel>
        <Select
          {...register("orderBy")}
          width="xxs"
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
        </Select>
      </HStack>
    </FormControl>
  );
};

export default SortBar;
