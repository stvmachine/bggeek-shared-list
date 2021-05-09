import React from "react";
import {
  Box,
  InputLeftElement,
  InputGroup,
  Input,
  Select,
  VStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import { SearchIcon } from "@chakra-ui/icons";

import { numberOfPlayersOptions, playingTimeOptions } from "../utils/constants";

const SearchSidebar = () => {
  const { register } = useFormContext();

  return (
    <form>
      <VStack width="xs">
        <Accordion defaultIndex={[0]} allowMultiple>
          <AccordionItem width="xs">
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  Section 1 title
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem width="xs">
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  Section 2 title
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
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
      </VStack>
    </form>
  );
};

export default SearchSidebar;
