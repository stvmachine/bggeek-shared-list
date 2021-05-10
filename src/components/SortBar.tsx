import React from "react";
import { HStack, Select } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

const SortBar = () => {
  const { register } = useFormContext();

  return (
    <HStack justifyContent="flex-end">
      <Select placeholder="Order by" {...register("orderBy")} width="xxs">
        <option value="name_asc" key="order_by_name_asc">
          Name: A-Z
        </option>
        <option value="name_desc" key="order_by_name_desc">
          Name: Z-A
        </option>
        <option value="rating_asc" key="order_by_rating_asc">
          Rating (asc)
        </option>
        <option value="rating_desc" key="order_by_rating_desc">
          Rating (desc)
        </option>
        <option value="year_asc" key="order_by_year_asc">
          Year (asc)
        </option>
        <option value="year_desc" key="order_by_year_desc">
          Year (desc)
        </option>
      </Select>
    </HStack>
  );
};

export default SortBar;
