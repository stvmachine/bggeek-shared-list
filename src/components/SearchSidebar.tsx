import { Accordion, Box, Button, Input, VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";

import useKeydown from "../hooks/useKeydown";
import { numberOfPlayersOptions, playingTimeOptions } from "../utils/constants";
import { ICollection } from "../utils/types";

type SearchSidebarProps = {
  members: string[];
  collections: ICollection[];
  addMember?: (members: string) => void;
  isOpenDrawer?: boolean;
  hotSeatError?: string;
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

const SearchSidebar = React.memo(({
  members,
  addMember,
  hotSeatError,
  collections,
  isOpenDrawer,
}: SearchSidebarProps) => {
  const [showHotSeat, displayHotSeat] = useState(false);
  const [hotSeatMember, setHotSeatMember] = useState("");
  const { register, handleSubmit, setValue, getValues } = useFormContext();
  const onSubmit = (_: any, event: any) => {
    event.preventDefault();
    hideVirtualKeyboard();
  };
  const onError = () => {};

  useKeydown(hideVirtualKeyboard);

  console.log(hotSeatError);
  return (
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      <VStack width={isOpenDrawer ? "100%" : "xs"}>
        <Input
          {...register("keyword")}
          placeholder="🔍 Search"
          width={isOpenDrawer ? "100%" : "xs"}
        />

        <Accordion.Root defaultValue={["0", "1"]} multiple>
          <Accordion.Item value="0" width="xs">
            <Accordion.ItemTrigger>
              <Box flex="1" textAlign="left">
                Basic filters
              </Box>
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>
            <Accordion.ItemContent pb={4}>
              <Box
                as="select"
                {...register("numberOfPlayers")}
                width="xxs"
                p={2}
                border="1px solid"
                borderColor="gray.300"
                borderRadius="md"
                bg="white"
              >
                <option value="">Number of players</option>
                {numberOfPlayersOptions &&
                  numberOfPlayersOptions.map((item) => (
                    <option
                      value={item.value}
                      key={`number_of_players_${item.value}`}
                    >
                      {item.name}
                    </option>
                  ))}
              </Box>
              <Box
                as="select"
                {...register("playingTime")}
                width="xxs"
                p={2}
                border="1px solid"
                borderColor="gray.300"
                borderRadius="md"
                bg="white"
                mt={2}
              >
                <option value="">Playing time</option>
                {playingTimeOptions &&
                  playingTimeOptions.map((item) => (
                    <option
                      value={item.value}
                      key={`playing_time_${item.value}`}
                    >
                      {item.name}
                    </option>
                  ))}
              </Box>
            </Accordion.ItemContent>
          </Accordion.Item>

          <Accordion.Item value="1" width="xs">
            <Accordion.ItemTrigger>
              <Box flex="1" textAlign="left">
                👥 Group Collectors ({members.length})
              </Box>
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>
            <Accordion.ItemContent pb={4}>
              {members && collections && (
                <Box>
                  <VStack alignItems={"flex-start"}>
                    <Button
                      onClick={() => displayHotSeat(!showHotSeat)}
                      colorPalette="blue"
                      type="button"
                      alignSelf="flex-end"
                      size="sm"
                    >
                      {!showHotSeat ? "Add Collector" : "Hide"}
                    </Button>

                    {showHotSeat && addMember && (
                      <Box id="hot-seat-member" py={3}>
                        <Box fontSize="sm" fontWeight="bold" mb={2}>
                          Add BoardGameGeek Username
                        </Box>
                        <Input
                          placeholder="Enter BGG username"
                          value={hotSeatMember}
                          onBlur={() => addMember(hotSeatMember)}
                          onChange={(e) => setHotSeatMember(e.target.value)}
                          size="sm"
                          borderColor={hotSeatError ? "red.500" : "gray.300"}
                        />
                        {hotSeatError && (
                          <Box color="red.500" fontSize="sm" mt={1}>
                            {hotSeatError}
                          </Box>
                        )}
                      </Box>
                    )}

                    {members.map((member, index) => (
                      <Box
                        key={`checkbox-${member}-${
                          isOpenDrawer ? "-mobile" : ""
                        }`}
                        display="flex"
                        alignItems="center"
                        gap={2}
                      >
                        <input
                          type="checkbox"
                          onChange={() => {
                            setValue(
                              `members[${member}]`,
                              !getValues(`members[${member}]`)
                            );
                          }}
                          checked={getValues(`members[${member}]`)}
                        />
                        <Box>{`${member} (${
                          collections[index]?.totalitems || 0
                        } games)`}</Box>
                      </Box>
                    ))}
                  </VStack>
                </Box>
              )}
            </Accordion.ItemContent>
          </Accordion.Item>
        </Accordion.Root>
      </VStack>
    </form>
  );
});

SearchSidebar.displayName = 'SearchSidebar';

export default SearchSidebar;
