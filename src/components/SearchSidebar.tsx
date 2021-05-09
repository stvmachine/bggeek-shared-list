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
  CheckboxGroup,
  Checkbox,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import { SearchIcon } from "@chakra-ui/icons";

import { numberOfPlayersOptions, playingTimeOptions } from "../utils/constants";

type SearchSidebarProps = {
  members: string[];
};

const SearchSidebar = ({ members }: SearchSidebarProps) => {
  const { register } = useFormContext();

  return (
    <form>
      <VStack width="xs">
        <InputGroup width="xs">
          <InputLeftElement
            pointerEvents="none"
            children={<SearchIcon color="gray.300" />}
          />
          <Input {...register("keyword")} placeholder="Search" />
        </InputGroup>

        <Accordion defaultIndex={[0,1]} allowMultiple>
          <AccordionItem width="xs">
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  Basic filters
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
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
                    <option
                      value={item.value}
                      key={`playing_time_${item.value}`}
                    >
                      {item.name}
                    </option>
                  ))}
              </Select>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem width="xs">
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  Members
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              {members && (
                <CheckboxGroup>
                  <VStack alignItems={"flex-start"}>
                    {members.map((member) => (
                      <Checkbox
                        {...register(`members[${member}]`)}
                        key={`checkbox-${member}`}
                        defaultIsChecked
                        isDisabled
                      >
                        {member}
                      </Checkbox>
                    ))}
                  </VStack>
                </CheckboxGroup>
              )}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </VStack>
    </form>
  );
};

export default SearchSidebar;
