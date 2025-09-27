import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  NativeSelect,
  Text,
  useBreakpointValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import React, { useCallback } from "react";
import { useFormContext } from "react-hook-form";
import {
  FiChevronDown,
  FiChevronUp,
  FiFilter,
  FiPlus,
  FiSearch,
  FiUsers,
  FiX,
} from "react-icons/fi";

import { SearchInput } from "./SearchInput";

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
  onDrawerOpen?: () => void;
  onDrawerClose?: () => void;
  // Mobile drawer control
  isMobileDrawerOpen?: boolean;
  onMobileDrawerToggle?: () => void;
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
    isMobileDrawerOpen,
    onMobileDrawerToggle,
  }: ImprovedSearchSidebarProps) => {
    const { register, handleSubmit, setValue, getValues, reset, watch } =
      useFormContext();

    const getMemberData = useCallback(
      (username: string) => ({
        username,
        color: {
          bg: `hsl(${username.length * 60}, 70%, 50%)`,
          color: "white",
        },
        initial: username.charAt(0).toUpperCase(),
      }),
      []
    );

    // Disclosure hooks for collapsible sections
    const { open: isFiltersOpen, onToggle: onFiltersToggle } = useDisclosure({
      defaultOpen: true,
    });
    const { open: isCollectorsOpen, onToggle: onCollectorsToggle } =
      useDisclosure({ defaultOpen: true });

    // Mobile drawer disclosure - use external control if provided
    const { open: internalDrawerOpen, onToggle: internalDrawerToggle } =
      useDisclosure({
        defaultOpen: false,
      });

    const isDrawerOpen =
      isMobileDrawerOpen !== undefined
        ? isMobileDrawerOpen
        : internalDrawerOpen;
    const onDrawerToggle = onMobileDrawerToggle || internalDrawerToggle;

    // Responsive breakpoint
    const isMobile = useBreakpointValue({ base: true, md: false });

    // State for quick actions - removed unused state

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

    // Removed unused handleRemoveMember function

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

    // Removed unused handleRefresh function

    const watchedMembers = getValues("members") || {};
    const selectedCount = members.filter(
      member => watchedMembers[member]
    ).length;
    const allSelected = members.length > 0 && selectedCount === members.length;

    // Check for active filters without causing re-renders
    const hasActiveFilters = () => {
      const values = getValues();
      return !!(values.keyword || values.numberOfPlayers || values.playingTime);
    };

    useKeydown(hideVirtualKeyboard);

    // Memoized member item component to prevent re-renders
    const MemberItem = React.memo(
      ({
        member,
        index,
        isOpenDrawer,
      }: {
        member: string;
        index: number;
        isOpenDrawer?: boolean;
      }) => {
        const memberData = getMemberData(member);
        const isSelected = watch(`members[${member}]`);
        if (!memberData) return null;

        return (
          <Box
            key={`checkbox-${member}-${isOpenDrawer ? "-mobile" : ""}`}
            p={3}
            borderRadius="xl"
            border="1px solid"
            borderColor={isSelected ? "blue.300" : "gray.200"}
            bg={isSelected ? "blue.50" : "white"}
            transition="all 0.2s"
            _hover={{
              borderColor: "blue.300",
              bg: isSelected ? "blue.100" : "gray.50",
              transform: "translateY(-1px)",
              boxShadow: "sm",
            }}
          >
            <HStack gap={3} width="100%">
              <input
                type="checkbox"
                onChange={() => {
                  setValue(`members[${member}]`, !isSelected);
                }}
                checked={isSelected}
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
                  onClick={() => removeMember(member)}
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
      }
    );

    // Sidebar content component
    const SidebarContent = () => (
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        style={{ height: "100%" }}
      >
        <VStack
          width={isOpenDrawer || isMobile ? "100%" : "340px"}
          gap={3}
          align="stretch"
          p={isOpenDrawer || isMobile ? 4 : 4}
          height="100%"
          overflowY="auto"
          pr={isMobile ? 0 : 2}
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

              <SearchInput />
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
                {hasActiveFilters() && (
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
                        onChange={e => {
                          setValue("numberOfPlayers", e.target.value);
                        }}
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
                        onChange={e => {
                          setValue("playingTime", e.target.value);
                        }}
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
                    {members.map((member, index) => (
                      <MemberItem
                        key={`member-${member}-${index}`}
                        member={member}
                        index={index}
                        isOpenDrawer={isOpenDrawer}
                      />
                    ))}
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
              disabled={!hasActiveFilters()}
            >
              <Icon as={FiX} mr={1} />
              Clear Filters
            </Button>
          </VStack>
        </VStack>
      </form>
    );

    // Mobile drawer trigger button - removed floating button
    // The hamburger menu will be handled by the parent component

    // Render mobile drawer or desktop sidebar
    if (isMobile) {
      return (
        <>
          {isDrawerOpen && (
            <Box
              position="fixed"
              top={0}
              left={0}
              right={0}
              bottom={0}
              bg="white"
              zIndex={1000}
              overflowY="auto"
              width="100vw"
              height="100vh"
            >
              <Box p={4} borderBottom="1px solid" borderColor="gray.200">
                <Flex align="center" justify="space-between">
                  <Flex align="center" gap={2}>
                    <Icon as={FiFilter} color="blue.500" boxSize={5} />
                    <Text fontSize="lg" fontWeight="bold" color="gray.700">
                      Search & Filters
                    </Text>
                  </Flex>
                  <Button variant="ghost" size="sm" onClick={onDrawerToggle}>
                    <Icon as={FiX} />
                  </Button>
                </Flex>
              </Box>
              <Box
                width="100%"
                height="calc(100vh - 80px)"
                overflowY="auto"
                p={0}
              >
                <SidebarContent />
              </Box>
            </Box>
          )}
        </>
      );
    }

    // Desktop sidebar
    return <SidebarContent />;
  }
);

ImprovedSearchSidebar.displayName = "ImprovedSearchSidebar";

export default ImprovedSearchSidebar;
