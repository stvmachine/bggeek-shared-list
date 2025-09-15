import { Accordion, Box, Button, Input, VStack, HStack, Text } from "@chakra-ui/react";
import React, { useState, useCallback } from "react";
import { useFormContext } from "react-hook-form";

import useKeydown from "../hooks/useKeydown";
import { numberOfPlayersOptions, playingTimeOptions } from "../utils/constants";
import { ICollection } from "../utils/types";
import { useMembers } from "../contexts/MemberContext";

type SearchSidebarProps = {
  members: string[];
  collections: ICollection[];
  addMember?: (members: string) => void;
  removeMember?: (member: string) => void;
  removeAllMembers?: () => void;
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
  removeMember,
  removeAllMembers,
  hotSeatError,
  collections,
  isOpenDrawer,
}: SearchSidebarProps) => {
  const [showHotSeat, displayHotSeat] = useState(false);
  const [hotSeatMember, setHotSeatMember] = useState("");
  const { register, handleSubmit, setValue, getValues } = useFormContext();
  const { getMemberData } = useMembers();
  
  
  const onSubmit = (_: any, event: any) => {
    event.preventDefault();
    hideVirtualKeyboard();
  };
  const onError = () => {};

  // Member management functions
  const handleSelectAll = useCallback(() => {
    members.forEach(member => {
      setValue(`members[${member}]`, true);
    });
  }, [members, setValue]);

  const handleDeselectAll = useCallback(() => {
    members.forEach(member => {
      setValue(`members[${member}]`, false);
    });
  }, [members, setValue]);

  const handleRemoveMember = useCallback((member: string) => {
    if (removeMember) {
      removeMember(member);
    }
  }, [removeMember]);

  const handleRemoveAllMembers = useCallback(() => {
    if (removeAllMembers) {
      removeAllMembers();
    }
  }, [removeAllMembers]);

  const watchedMembers = getValues("members") || {};
  const selectedCount = Object.values(watchedMembers).filter(Boolean).length;
  const allSelected = members.length > 0 && selectedCount === members.length;

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
                <HStack justify="space-between" width="100%">
                  <Text>👥 Group Collectors ({members.length})</Text>
                  <Text fontSize="sm" color="gray.500">
                    {selectedCount}/{members.length} selected
                  </Text>
                </HStack>
              </Box>
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>
            <Accordion.ItemContent pb={4}>
              {members && collections && (
                <Box>
                  <VStack alignItems={"flex-start"}>
                    <HStack width="100%" gap={2} flexWrap="wrap" mb={2}>
                      <Button
                        onClick={() => displayHotSeat(!showHotSeat)}
                        colorPalette="blue"
                        type="button"
                        size="sm"
                        flex="1"
                        minWidth="120px"
                      >
                        {!showHotSeat ? "Add Collector" : "Hide"}
                      </Button>
                      
                      {members.length > 0 && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            colorPalette="blue"
                            onClick={allSelected ? handleDeselectAll : handleSelectAll}
                            flex="1"
                            minWidth="100px"
                          >
                            {allSelected ? "Deselect All" : "Select All"}
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            colorPalette="red"
                            onClick={handleRemoveAllMembers}
                            flex="1"
                            minWidth="100px"
                          >
                            Remove All
                          </Button>
                        </>
                      )}
                    </HStack>

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

                    {members.map((member, index) => {
                      const memberData = getMemberData(member);
                      if (!memberData) return null;
                      
                      return (
                        <Box
                          key={`checkbox-${member}-${
                            isOpenDrawer ? "-mobile" : ""
                          }`}
                          display="flex"
                          alignItems="center"
                          gap={3}
                          py={2}
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
                          <HStack gap={2} width="100%">
                            <Box
                              width="28px"
                              height="28px"
                              borderRadius="full"
                              bg={memberData.color.bg}
                              color={memberData.color.color}
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              fontSize="xs"
                              fontWeight="bold"
                            >
                              {memberData.initial}
                            </Box>
                            <Box flex="1">
                              <Box fontWeight="medium">{member}</Box>
                              <Box fontSize="sm" color="gray.500">
                                {collections[index]?.totalitems || 0} games
                              </Box>
                            </Box>
                            {removeMember && (
                              <Button
                                size="xs"
                                variant="outline"
                                colorPalette="red"
                                onClick={() => handleRemoveMember(member)}
                                title={`Remove ${member}`}
                              >
                                ✕
                              </Button>
                            )}
                          </HStack>
                        </Box>
                      );
                    })}
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
