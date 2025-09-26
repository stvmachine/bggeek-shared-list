import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  Input,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { NativeSelect } from "@chakra-ui/react";
import React, { useCallback, useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  FiChevronDown,
  FiChevronUp,
  FiFilter,
  FiPlus,
  FiSearch,
  FiSettings,
  FiUsers,
  FiX
} from "react-icons/fi";

// import { useMembers } from "../contexts/MemberContext";
import useKeydown from "../hooks/useKeydown";
import { numberOfPlayersOptions, playingTimeOptions } from "../utils/constants";
import { ICollection } from "../utils/types";

import UsernameManager from "./UsernameManager";

type ImprovedSearchSidebarProps = {
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

const ImprovedSearchSidebar = React.memo(
  ({
    members,
    onSearch,
    onValidatedUsernames,
    onValidationError,
    removeMember,
    removeAllMembers,
    collections,
    isOpenDrawer,
  }: ImprovedSearchSidebarProps) => {
    const { register, handleSubmit, setValue, getValues, watch, reset } =
      useFormContext();

    // Mock getMemberData function for demo
    const getMemberData = (username: string) => ({
      username,
      color: {
        bg: `hsl(${username.length * 60}, 70%, 50%)`,
        color: "white",
      },
      initial: username.charAt(0).toUpperCase(),
    });

    // Disclosure hooks for collapsible sections
    const { open: isFiltersOpen, onToggle: onFiltersToggle } = useDisclosure({
      defaultOpen: true,
    });
    const { open: isCollectorsOpen, onToggle: onCollectorsToggle } =
      useDisclosure({ defaultOpen: true });

    // State for quick actions
    const [isRefreshing, setIsRefreshing] = useState(false);

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

    const handleClearFilters = useCallback(() => {
      reset({
        keyword: "",
        numberOfPlayers: "",
        playingTime: "",
        groupBy: "none",
        orderBy: "name_asc",
      });
    }, [reset]);

    const handleRefresh = useCallback(async () => {
      setIsRefreshing(true);
      // Simulate refresh - in real app, this would refetch data
      setTimeout(() => setIsRefreshing(false), 1000);
    }, []);

    const watchedMembers = getValues("members") || {};
    const selectedCount = members.filter(
      member => watchedMembers[member]
    ).length;
    const allSelected = members.length > 0 && selectedCount === members.length;
    const hasActiveFilters =
      watch("keyword") || watch("numberOfPlayers") || watch("playingTime");

    useKeydown(hideVirtualKeyboard);

    return (
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        style={{ height: "100%" }}
      >
        <VStack
          width={isOpenDrawer ? "100%" : "340px"}
          gap={3}
          align="stretch"
          p={isOpenDrawer ? 0 : 4}
          height="100%"
          overflowY="auto"
          pr={2}
          css={{
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "gray.300",
              borderRadius: "6px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: "gray.400",
            },
          }}
        >
          {/* Search Section */}
          <Box
            border="1px solid"
            borderColor="gray.200"
            borderRadius="xl"
            p={5}
            bg="white"
            boxShadow="sm"
            _hover={{ boxShadow: "md" }}
            transition="all 0.2s"
          >
            <VStack gap={4} align="stretch">
              <Flex align="center" gap={2}>
                <Icon as={FiSearch} color="blue.500" boxSize={5} />
                <Text fontSize="lg" fontWeight="bold" color="gray.700">
                  Search Games
                </Text>
              </Flex>

              <Input
                {...register("keyword")}
                placeholder="🔍 Search by game name..."
                size="md"
                borderRadius="xl"
                borderColor="gray.300"
                _focus={{
                  borderColor: "blue.400",
                  boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)",
                }}
                _hover={{ borderColor: "gray.400" }}
              />
            </VStack>
          </Box>

          {/* Filters Section */}
          <Box
            border="1px solid"
            borderColor="gray.200"
            borderRadius="xl"
            bg="white"
            boxShadow="sm"
            _hover={{ boxShadow: "md" }}
            transition="all 0.2s"
          >
            <Button
              onClick={onFiltersToggle}
              variant="ghost"
              width="100%"
              justifyContent="space-between"
              p={5}
              height="auto"
              _hover={{ bg: "gray.50" }}
            >
              <Flex align="center" gap={2}>
                <Icon as={FiFilter} color="blue.500" boxSize={5} />
                <Text fontSize="lg" fontWeight="bold" color="gray.700">
                  Filters
                </Text>
                {hasActiveFilters && (
                  <Badge colorScheme="blue" variant="solid" fontSize="xs">
                    Active
                  </Badge>
                )}
              </Flex>
              <Icon
                as={isFiltersOpen ? FiChevronUp : FiChevronDown}
                color="gray.400"
              />
            </Button>

            {isFiltersOpen && (
              <Box px={5} pb={5}>
                <VStack gap={4} align="stretch">
                  <Box>
                    <Text
                      fontSize="sm"
                      fontWeight="medium"
                      color="gray.600"
                      mb={2}
                    >
                      Number of Players
                    </Text>
                    <NativeSelect.Root>
                      <NativeSelect.Field
                        {...register("numberOfPlayers")}
                        placeholder="Any number of players"
                        borderRadius="xl"
                        borderColor="gray.300"
                        _focus={{ borderColor: "blue.400" }}
                        _hover={{ borderColor: "gray.400" }}
                      >
                        {numberOfPlayersOptions?.map(item => (
                          <option
                            value={item.value}
                            key={`number_of_players_${item.value}`}
                          >
                            {item.name}
                          </option>
                        ))}
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
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
                    <NativeSelect.Root>
                      <NativeSelect.Field
                        {...register("playingTime")}
                        placeholder="Any playing time"
                        borderRadius="xl"
                        borderColor="gray.300"
                        _focus={{ borderColor: "blue.400" }}
                        _hover={{ borderColor: "gray.400" }}
                      >
                        {playingTimeOptions?.map(item => (
                          <option
                            value={item.value}
                            key={`playing_time_${item.value}`}
                          >
                            {item.name}
                          </option>
                        ))}
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                  </Box>
                </VStack>
              </Box>
            )}
          </Box>

          {/* Collectors Section */}
          <Box
            border="1px solid"
            borderColor="gray.200"
            borderRadius="xl"
            bg="white"
            boxShadow="sm"
            _hover={{ boxShadow: "md" }}
            transition="all 0.2s"
          >
            <Button
              onClick={onCollectorsToggle}
              variant="ghost"
              width="100%"
              justifyContent="space-between"
              p={5}
              height="auto"
              _hover={{ bg: "gray.50" }}
            >
              <Flex align="center" gap={2}>
                <Icon as={FiUsers} color="blue.500" boxSize={5} />
                <Text fontSize="lg" fontWeight="bold" color="gray.700">
                  Group Collectors
                </Text>
                <Badge colorScheme="blue" variant="subtle" fontSize="sm">
                  {selectedCount}/{members.length}
                </Badge>
              </Flex>
              <Icon
                as={isCollectorsOpen ? FiChevronUp : FiChevronDown}
                color="gray.400"
              />
            </Button>

            {isCollectorsOpen && (
              <Box px={5} pb={5}>
                <VStack gap={4} align="stretch">
                  {/* Quick Actions */}
                  {members.length > 0 && (
                    <HStack gap={2} flexWrap="wrap">
                        <Button
                          size="sm"
                          variant="outline"
                          colorScheme="blue"
                          onClick={
                            allSelected ? handleDeselectAll : handleSelectAll
                          }
                          borderRadius="xl"
                          fontSize="xs"
                          flex="1"
                          minWidth="100px"
                        >
                          <Icon as={allSelected ? FiX : FiPlus} mr={1} />
                          {allSelected ? "Deselect All" : "Select All"}
                        </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        colorScheme="red"
                        onClick={handleRemoveAllMembers}
                        borderRadius="xl"
                        fontSize="xs"
                        flex="1"
                        minWidth="100px"
                      >
                        <Icon as={FiX} mr={1} />
                        Remove All
                      </Button>
                    </HStack>
                  )}

                  {/* Username Manager */}
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

                  {/* Members List */}
                  <VStack
                    gap={2}
                    align="stretch"
                    maxHeight="300px"
                    overflowY="auto"
                  >
                    {members.map((member, index) => {
                      const memberData = getMemberData(member);
                      if (!memberData) return null;

                      return (
                        <Box
                          key={`checkbox-${member}-${isOpenDrawer ? "-mobile" : ""}`}
                          p={3}
                          borderRadius="xl"
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
                            transform: "translateY(-1px)",
                            boxShadow: "sm",
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
                                width: "18px",
                                height: "18px",
                                accentColor: "var(--chakra-colors-blue-500)",
                              }}
                            />
                            <Box
                              width="36px"
                              height="36px"
                              borderRadius="full"
                              bg={memberData.color.bg}
                              color={memberData.color.color}
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              fontSize="sm"
                              fontWeight="bold"
                              flexShrink={0}
                              boxShadow="sm"
                            >
                              {memberData.initial}
                            </Box>
                            <Box flex="1" minWidth={0}>
                              <Text fontWeight="medium" fontSize="sm" truncate>
                                {member}
                              </Text>
                              <Text fontSize="xs" color="gray.500">
                                {collections[index]?.totalitems || 0} games
                              </Text>
                            </Box>
                            {removeMember && (
                              <IconButton
                                size="xs"
                                variant="ghost"
                                colorScheme="red"
                                onClick={() => handleRemoveMember(member)}
                                borderRadius="full"
                                width="24px"
                                height="24px"
                                minWidth="24px"
                              >
                                <Icon as={FiX} />
                              </IconButton>
                            )}
                          </HStack>
                        </Box>
                      );
                    })}
                  </VStack>
                </VStack>
              </Box>
            )}
          </Box>

          {/* Action Buttons */}
          <VStack gap={2} align="stretch">
            <Button
              onClick={handleClearFilters}
              variant="outline"
              colorScheme="gray"
              size="md"
              borderRadius="xl"
              disabled={!hasActiveFilters}
            >
              <Icon as={FiX} mr={1} />
              Clear Filters
            </Button>

            <Button
              onClick={handleRefresh}
              colorScheme="blue"
              variant="solid"
              size="md"
              borderRadius="xl"
              loading={isRefreshing}
              loadingText="Refreshing..."
              spinnerPlacement="start"
            >
              Apply Filters
            </Button>
          </VStack>

          {/* Footer */}
          <Box pt={4} divideY={"12px"}>
            <Flex
              align="center"
              justify="space-between"
              color="gray.500"
              fontSize="xs"
            >
              <Text>Made with ❤️</Text>
              <HStack gap={1}>
                <Icon as={FiSettings} boxSize={3} />
                <Text>Settings</Text>
              </HStack>
            </Flex>
          </Box>
        </VStack>
      </form>
    );
  }
);

ImprovedSearchSidebar.displayName = "ImprovedSearchSidebar";

export default ImprovedSearchSidebar;
