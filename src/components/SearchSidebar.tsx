import React from "react";
import {
  InputLeftElement,
  InputGroup,
  Input,
  Select,
  Wrap,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import { SearchIcon } from "@chakra-ui/icons";

import { numberOfPlayersOptions, playingTimeOptions } from "../utils/constants";

const SearchSidebar = () => {
  const { register } = useFormContext();

  return (
    <form>
      <Wrap>
        <InputGroup width="xs">
          <InputLeftElement
            pointerEvents="none"
            children={<SearchIcon color="gray.300" />}
          />
          <Input {...register("keyword")} placeholder="Search" />
        </InputGroup>
        <Select
          {...register("numberOfPlayers")}
          placeholder="Number of players"
          width="xxs"
        >
          {numberOfPlayersOptions &&
            numberOfPlayersOptions.map((item) => (
              <option
                value={item.value}
                key={`number_of_players_${item.value}`}
              >
                {item.name}
              </option>
            ))}
        </Select>

        <Select
          {...register("playingTime")}
          placeholder="Playing time"
          width="xxs"
        >
          {playingTimeOptions &&
            playingTimeOptions.map((item) => (
              <option value={item.value} key={`playing_time_${item.value}`}>
                {item.name}
              </option>
            ))}
        </Select>
      </Wrap>
    </form>
  );
};

export default SearchSidebar;
