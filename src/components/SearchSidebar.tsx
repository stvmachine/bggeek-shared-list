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
import { ICollection } from "../utils/types";
import useKeydown from "../hooks/useKeydown";

type SearchSidebarProps = {
  members: string[];
  collections: ICollection[];
  isOpenDrawer?: boolean;
};

const hideVirtualKeyboard = (): void => {
  if (
    document.activeElement &&
    (document.activeElement as HTMLElement).blur &&
    typeof (document.activeElement as HTMLElement).blur === "function"
  ) {
    (document.activeElement as HTMLElement).blur();
  }
};

const SearchSidebar = ({
  members,
  collections,
  isOpenDrawer,
}: SearchSidebarProps) => {
  const { register, handleSubmit, setValue, getValues } = useFormContext();
  const onSubmit = (_: any, event: any) => {
    event.preventDefault();
    hideVirtualKeyboard();
  };
  const onError = () => {};

  useKeydown(hideVirtualKeyboard);

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      <VStack width={isOpenDrawer ? "100%" : "xs"}>
        <InputGroup width={isOpenDrawer ? "100%" : "xs"}>
          <InputLeftElement
            pointerEvents="none"
            children={<SearchIcon color="gray.300" />}
          />
          <Input {...register("keyword")} placeholder="Search" />
        </InputGroup>

        <Accordion defaultIndex={[0, 1]} allowMultiple>
          <AccordionItem width="xs" key="accordion-basic-filters">
            <h2>
              <AccordionButton id="basic-filters-accordion-button">
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

          <AccordionItem width="xs" key="accordion-members">
            <h2>
              <AccordionButton id="members-accordion-button">
                <Box flex="1" textAlign="left">
                  Members
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              {members && collections && (
                <CheckboxGroup>
                  <VStack alignItems={"flex-start"}>
                    {members.map((member, index) => (
                      <Checkbox
                        key={`checkbox-${member}-${
                          isOpenDrawer ? "-mobile" : ""
                        }`}
                        onChange={() => {
                          setValue(
                            `members[${member}]`,
                            !getValues(`members[${member}]`)
                          );
                        }}
                        isChecked={getValues(`members[${member}]`)}
                      >
                        {`${member} (${collections[index]?.totalitems})`}
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
