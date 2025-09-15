import { Box, Button, HStack, Input, Text, VStack } from "@chakra-ui/react";
import React, { useCallback } from "react";
import { useFormContext } from "react-hook-form";
import UsernameManager from "./UsernameManager";

import { useMembers } from "../contexts/MemberContext";
import useKeydown from "../hooks/useKeydown";
import { numberOfPlayersOptions, playingTimeOptions } from "../utils/constants";
import { ICollection } from "../utils/types";

type SearchSidebarProps = {
  members: string[];
  collections: ICollection[];
  onSearch?: (usernames: string[]) => void;
  onValidatedUsernames?: (usernames: string[]) => void;
  onValidationError?: () => void;
  removeMember?: (member: string) => void;
  removeAllMembers?: () => void;
  isOpenDrawer?: boolean;
  isValidating?: boolean;
  pendingUsernames?: string[];
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

const SearchSidebar = React.memo(
  ({
    members,
    onSearch,
    onValidatedUsernames,
    onValidationError,
    removeMember,
    removeAllMembers,
    collections,
    isOpenDrawer,
  }: SearchSidebarProps) => {
    const { register, handleSubmit, setValue, getValues } = useFormContext();
    const { getMemberData } = useMembers();

    const onSubmit = (_: any, event: any) => {
      event.preventDefault();
      hideVirtualKeyboard();
    };
    const onError = () => {};

    // Member management functions
    const handleSelectAll = useCallback(() => {
      members.forEach((member) => {
        setValue(`members[${member}]`, true);
      });
    }, [members, setValue]);

    const handleDeselectAll = useCallback(() => {
      members.forEach((member) => {
        setValue(`members[${member}]`, false);
      });
    }, [members, setValue]);

    const handleRemoveMember = useCallback(
      (member: string) => {
        if (removeMember) {
          removeMember(member);
        }
      },
      [removeMember]
    );

    const handleRemoveAllMembers = useCallback(() => {
      if (removeAllMembers) {
        removeAllMembers();
      }
    }, [removeAllMembers]);

    const handleSearch = useCallback(
      (usernames: string[]) => {
        if (onSearch) {
          onSearch(usernames);
        }
      },
      [onSearch]
    );

    const watchedMembers = getValues("members") || {};
    // Only count members that actually exist in the current members array
    const selectedCount = members.filter(
      (member) => watchedMembers[member]
    ).length;
    const allSelected = members.length > 0 && selectedCount === members.length;

    useKeydown(hideVirtualKeyboard);

    return (
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <VStack width={isOpenDrawer ? "100%" : "xs"}>
          <Input
            {...register("keyword")}
            placeholder="🔍 Search"
            width={isOpenDrawer ? "100%" : "xs"}
          />

          <VStack gap={4} align="stretch">
            <Box>
              <Text fontWeight="semibold" mb={3} color="gray.700">
                Basic filters
              </Text>
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
            </Box>

            <Box height="1px" bg="gray.200" my={4} />

            <Box>
              <HStack justify="space-between" width="100%" mb={3}>
                <Text fontWeight="semibold" color="gray.700">
                  👥 Group Collectors ({members.length})
                </Text>
                <Text fontSize="sm" color="gray.500">
                  {selectedCount}/{members.length} selected
                </Text>
              </HStack>
              {members && collections && (
                <Box>
                  <VStack alignItems={"flex-start"}>
                    <HStack width="100%" gap={2} flexWrap="wrap" mb={2}>
                      {members.length > 0 && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            colorPalette="blue"
                            onClick={
                              allSelected ? handleDeselectAll : handleSelectAll
                            }
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

                    <UsernameManager
                      onUsernamesChange={handleSearch}
                      onValidatedUsernames={onValidatedUsernames}
                      onValidationError={onValidationError}
                      initialUsernames={members}
                      noForm={true}
                      showRemoveAll={true}
                      onRemoveAll={handleRemoveAllMembers}
                      hidePills={true}
                    />

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
            </Box>
          </VStack>
        </VStack>
      </form>
    );
  }
);

SearchSidebar.displayName = "SearchSidebar";

export default SearchSidebar;
