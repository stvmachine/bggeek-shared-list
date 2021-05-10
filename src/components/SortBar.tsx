import React from "react";
import { HStack, Select } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

const SortBar = () => {
  const { register } = useFormContext();

  return (
    <HStack justifyContent="flex-end">
      <Select placeholder="Order by" {...register("orderBy")} width="xxs">
        <option value="name" key="order_by_name">Name</option>
        <option value="rating" key="order_by_rating">Rating</option>
        <option value="numowned" key="order_by_numowned">Num. Owned</option>
        <option value="year" key="order_by_year">Year</option>
      </Select>
    </HStack>
  );
};

export default SortBar;
