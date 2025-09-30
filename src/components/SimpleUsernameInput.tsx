import React, { useState } from "react";
import {
  Input,
  Button,
  VStack,
  HStack,
  Text,
  Badge,
  IconButton,
} from "@chakra-ui/react";
import { FiX, FiPlus } from "react-icons/fi";
import { toaster } from "./ui/toaster";

interface SimpleUsernameInputProps {
  onAddUsername: (username: string) => void;
  usernames: string[];
  onRemoveUsername: (username: string) => void;
  onRemoveAll: () => void;
  isLoading?: boolean;
  validUsers?: string[];
  invalidUsers?: string[];
  totalUsers?: number;
  validUserCount?: number;
}

export default function SimpleUsernameInput({
  onAddUsername,
  usernames,
  onRemoveUsername,
  onRemoveAll,
  isLoading = false,
  validUsers = [],
  invalidUsers = [],
}: SimpleUsernameInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim()) {
      toaster.create({
        title: "Empty input",
        description: "Please enter a username",
        type: "warning",
        duration: 3000,
      });
      return;
    }

    if (usernames.includes(inputValue.trim())) {
      toaster.create({
        title: "Username already added",
        description: `${inputValue.trim()} is already in the list`,
        type: "warning",
        duration: 3000,
      });
      return;
    }

    // Show loading toast
    toaster.create({
      title: "Validating username...",
      description: `Checking ${inputValue.trim()} and fetching collection`,
      type: "loading",
    });
    
    await onAddUsername(inputValue.trim());
    setInputValue("");
    
    // Show success toast
    toaster.create({
      title: "Username added successfully!",
      description: `${inputValue.trim()} has been added to the collection`,
      type: "success",
    });
  };


  return (
    <VStack spacing={4} align="stretch">
      <Text fontSize="lg" fontWeight="semibold">
        Add Collectors
      </Text>

      <div>
        <HStack>
          <Input
            placeholder="Enter BGG username"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            disabled={isLoading}
            size="sm"
          />
          <Button
            onClick={handleSubmit}
            colorScheme="blue"
            size="sm"
            loading={isLoading}
            loadingText="Adding..."
          >
            <FiPlus />
          </Button>
        </HStack>
      </div>

      {/* Current usernames */}
      {usernames.length > 0 && (
        <VStack spacing={2} align="stretch">
          <HStack justify="space-between">
            <Text fontSize="md" fontWeight="medium">
              Collectors ({usernames.length})
            </Text>
            {usernames.length > 1 && (
              <Button
                size="xs"
                variant="ghost"
                colorScheme="red"
                onClick={() => {
                  onRemoveAll();
                  toaster.create({
                    title: "All usernames removed",
                    description: "All usernames have been removed from the collection",
                    type: "info",
                  });
                }}
                disabled={isLoading}
              >
                Remove All
              </Button>
            )}
          </HStack>

          <VStack spacing={1} align="stretch">
            {usernames.map(username => {
              const isValid = validUsers.includes(username);
              const isInvalid = invalidUsers.includes(username);
              const isPending = !isValid && !isInvalid && isLoading;
              
              return (
                <HStack
                  key={username}
                  justify="space-between"
                  p={2}
                  bg={
                    isInvalid 
                      ? "red.50" 
                      : isValid 
                        ? "green.50" 
                        : isPending 
                          ? "yellow.50" 
                          : "gray.50"
                  }
                  borderRadius="md"
                  border="1px solid"
                  borderColor={
                    isInvalid 
                      ? "red.200" 
                      : isValid 
                        ? "green.200" 
                        : isPending 
                          ? "yellow.200" 
                          : "gray.200"
                  }
                >
                  <HStack>
                    <Text fontSize="sm" fontWeight={isValid ? "medium" : "normal"}>
                      {username}
                    </Text>
                    {isValid && (
                      <Badge size="sm" colorScheme="green">
                        Valid
                      </Badge>
                    )}
                    {isInvalid && (
                      <Badge size="sm" colorScheme="red">
                        Invalid
                      </Badge>
                    )}
                    {isPending && (
                      <Badge size="sm" colorScheme="yellow">
                        Loading...
                      </Badge>
                    )}
                  </HStack>
                  <IconButton
                    size="xs"
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => {
                      onRemoveUsername(username);
                      toaster.create({
                        title: "Username removed",
                        description: `${username} has been removed from the collection`,
                        type: "info",
                      });
                    }}
                    disabled={isLoading}
                    aria-label={`Remove ${username}`}
                  >
                    <FiX />
                  </IconButton>
                </HStack>
              );
            })}
          </VStack>
        </VStack>
      )}
    </VStack>
  );
}
