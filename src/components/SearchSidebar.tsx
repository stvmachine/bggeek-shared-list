import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useCallback } from "react";
import { useFormContext } from "react-hook-form";

import { useMembers } from "../contexts/MemberContext";
import useKeydown from "../hooks/useKeydown";
import { numberOfPlayersOptions, playingTimeOptions } from "../utils/constants";
import { ICollection } from "../utils/types";

import UsernameManager from "./UsernameManager";

type SearchSidebarProps = {
  members: string[];
  collections: ICollection[];
  onSearch?: (_usernames: string[]) => void;
  onValidatedUsernames?: (_usernames: string[]) => void;
  onValidationError?: () => void;
  removeMember?: (_member: string) => void;
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
      members.forEach(member => {
        setValue(`members[${member}]`, true);
      });
    }, [members, setValue]);

    const handleDeselectAll = useCallback(() => {
      members.forEach(member => {
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
      member => watchedMembers[member]
    ).length;
    const allSelected = members.length > 0 && selectedCount === members.length;

    useKeydown(hideVirtualKeyboard);

    return (
      <form onSubmit={handleSubmit(onSubmit, onError)} style={{ height: '100%' }}>
        <VStack
          width={isOpenDrawer ? "100%" : "320px"}
          gap={4}
          align="stretch"
          p={isOpenDrawer ? 0 : 4}
          height="100%"
          overflowY="auto"
          pr={2}
          css={{
            '&::-webkit-scrollbar': {
              width: '4px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'gray.300',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: 'gray.400',
            },
          }}
        >
          {/* Search Section */}
          <Box
            border="1px solid"
            borderColor="gray.200"
            borderRadius="lg"
            p={4}
            bg="white"
          >
            <VStack gap={3} align="stretch">
              <Text fontSize="lg" fontWeight="bold" color="gray.700">
                🔍 Search Games
              </Text>
              <Input
                {...register("keyword")}
                placeholder="Search by game name..."
                size="md"
                borderRadius="lg"
                borderColor="gray.300"
                _focus={{
                  borderColor: "blue.400",
                  boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)",
                }}
              />
            </VStack>
          </Box>

          {/* Filters Section */}
          <Box
            border="1px solid"
            borderColor="gray.200"
            borderRadius="lg"
            p={4}
            bg="white"
          >
            <VStack gap={4} align="stretch">
              <Text fontSize="lg" fontWeight="bold" color="gray.700" mb={2}>
                🎯 Filters
              </Text>

              <VStack gap={3} align="stretch">
                <Box>
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    color="gray.600"
                    mb={2}
                  >
                    Number of Players
                  </Text>
                  <Box
                    as="select"
                    {...register("numberOfPlayers")}
                    width="100%"
                    p={3}
                    border="1px solid"
                    borderColor="gray.300"
                    borderRadius="lg"
                    bg="white"
                    fontSize="sm"
                    _focus={{
                      borderColor: "blue.400",
                      boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)",
                    }}
                  >
                    <option value="">Any number of players</option>
                    {numberOfPlayersOptions &&
                      numberOfPlayersOptions.map(item => (
                        <option
                          value={item.value}
                          key={`number_of_players_${item.value}`}
                        >
                          {item.name}
                        </option>
                      ))}
                  </Box>
                </Box>

                <Box>
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    color="gray.600"
                    mb={2}
                  >
                    Playing Time
                  </Text>
                  <Box
                    as="select"
                    {...register("playingTime")}
                    width="100%"
                    p={3}
                    border="1px solid"
                    borderColor="gray.300"
                    borderRadius="lg"
                    bg="white"
                    fontSize="sm"
                    _focus={{
                      borderColor: "blue.400",
                      boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)",
                    }}
                  >
                    <option value="">Any playing time</option>
                    {playingTimeOptions &&
                      playingTimeOptions.map(item => (
                        <option
                          value={item.value}
                          key={`playing_time_${item.value}`}
                        >
                          {item.name}
                        </option>
                      ))}
                  </Box>
                </Box>
              </VStack>
            </VStack>
          </Box>

          {/* Members Section */}
          <Box
            border="1px solid"
            borderColor="gray.200"
            borderRadius="lg"
            p={4}
            bg="white"
          >
            <VStack gap={4} align="stretch">
              <Flex justify="space-between" align="center" width="100%">
                <Text fontSize="lg" fontWeight="bold" color="gray.700">
                  👥 Group Collectors
                </Text>
                <Badge colorScheme="blue" variant="subtle" fontSize="sm">
                  {selectedCount}/{members.length} selected
                </Badge>
              </Flex>
              {members && collections && (
                <Box>
                  <VStack alignItems={"flex-start"}>
                    <HStack width="100%" gap={2} flexWrap="wrap" mb={3}>
                      {members.length > 0 && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            colorScheme="blue"
                            onClick={
                              allSelected ? handleDeselectAll : handleSelectAll
                            }
                            flex="1"
                            minWidth="100px"
                            borderRadius="lg"
                            fontSize="xs"
                          >
                            {allSelected ? "Deselect All" : "Select All"}
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            colorScheme="red"
                            onClick={handleRemoveAllMembers}
                            flex="1"
                            minWidth="100px"
                            borderRadius="lg"
                            fontSize="xs"
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

                    <VStack
                      gap={2}
                      align="stretch"
                      maxHeight="300px"
                      overflowY="auto"
                      width="100%"
                    >
                      {members.map((member, index) => {
                        const memberData = getMemberData(member);
                        if (!memberData) return null;

                        return (
                          <Box
                            key={`checkbox-${member}-${
                              isOpenDrawer ? "-mobile" : ""
                            }`}
                            p={3}
                            borderRadius="lg"
                            border="1px solid"
                            borderColor="gray.200"
                            bg={
                              getValues(`members[${member}]`)
                                ? "blue.50"
                                : "white"
                            }
                            transition="all 0.2s"
                            _hover={{
                              borderColor: "blue.300",
                              bg: getValues(`members[${member}]`)
                                ? "blue.100"
                                : "gray.50",
                            }}
                          >
                            <HStack gap={3} width="100%">
                              <input
                                type="checkbox"
                                onChange={() => {
                                  setValue(
                                    `members[${member}]`,
                                    !getValues(`members[${member}]`)
                                  );
                                }}
                                checked={getValues(`members[${member}]`)}
                                style={{
                                  width: "16px",
                                  height: "16px",
                                  accentColor: "var(--chakra-colors-blue-500)",
                                }}
                              />
                              <Box
                                width="32px"
                                height="32px"
                                borderRadius="full"
                                bg={memberData.color.bg}
                                color={memberData.color.color}
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                fontSize="sm"
                                fontWeight="bold"
                                flexShrink={0}
                              >
                                {memberData.initial}
                              </Box>
                              <Box flex="1" minWidth={0}>
                                <Text
                                  fontWeight="medium"
                                  fontSize="sm"
                                  truncate
                                >
                                  {member}
                                </Text>
                                <Text fontSize="xs" color="gray.500">
                                  {collections[index]?.totalitems || 0} games
                                </Text>
                              </Box>
                              {removeMember && (
                                <Button
                                  size="xs"
                                  variant="ghost"
                                  colorScheme="red"
                                  onClick={() => handleRemoveMember(member)}
                                  title={`Remove ${member}`}
                                  borderRadius="full"
                                  width="24px"
                                  height="24px"
                                  minWidth="24px"
                                  p={0}
                                >
                                  ✕
                                </Button>
                              )}
                            </HStack>
                          </Box>
                        );
                      })}
                    </VStack>
                  </VStack>
                </Box>
              )}
            </VStack>
          </Box>
        </VStack>
      </form>
    );
  }
);

SearchSidebar.displayName = "SearchSidebar";

export default SearchSidebar;
