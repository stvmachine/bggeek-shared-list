import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { getBggUser } from "bgg-xml-api-client";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { useUsernames } from "../hooks/useUsernames";

type FormData = {
  username: string;
};

type UsernameFormProps = {
  onSearch: () => void;
  isValidating: boolean;
};

const UsernameForm: React.FC<UsernameFormProps> = ({
  onSearch,
  isValidating,
}) => {
  const { usernames, addUsername, removeUsername } = useUsernames();
  const [usernameToValidate, setUsernameToValidate] = useState<string | null>(
    null
  );

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      username: "",
    },
  });

  // Use useQuery for username validation
  const {
    data: userData,
    isLoading: isValidatingUsername,
    error: validationError,
  } = useQuery(
    ["validateUser", usernameToValidate],
    () => getBggUser({ name: usernameToValidate! }),
    {
      enabled: !!usernameToValidate,
      retry: (failureCount, error: any) => {
        // Don't retry on 404 or user not found errors
        if (error?.response?.status === 404) {
          return false;
        }
        // Don't retry if the error suggests user doesn't exist
        if (
          error?.message?.includes("not found") ||
          error?.message?.includes("404")
        ) {
          return false;
        }
        // Only retry network errors once
        return failureCount < 1;
      },
      retryDelay: 1000, // 1 second delay between retries
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      onError: (error: any) => {
        // Log the error for debugging
        console.log("Username validation error:", error);
      },
    }
  );

  // Handle validation result when query completes
  React.useEffect(() => {
    if (usernameToValidate && !isValidatingUsername) {
      if (userData?.data?.id) {
        // Username is valid, add it to the list
        addUsername(usernameToValidate);
        reset();
        clearErrors();
      } else if (validationError) {
        // Handle different types of errors
        const error = validationError as any;
        let errorMessage = `Username "${usernameToValidate}" not found on BoardGameGeek`;

        if (
          error?.response?.status === 404 ||
          error?.message?.includes("404")
        ) {
          errorMessage = `Username "${usernameToValidate}" does not exist on BoardGameGeek`;
        } else if (
          error?.code === "NETWORK_ERROR" ||
          error?.message?.includes("network")
        ) {
          errorMessage = `Network error. Please check your connection and try again.`;
        } else if (error?.response?.status >= 500) {
          errorMessage = `BoardGameGeek is temporarily unavailable. Please try again later.`;
        }

        setError("username", {
          type: "manual",
          message: errorMessage,
        });
      } else if (!userData?.data?.id && usernameToValidate) {
        // No error but also no valid user data - treat as not found
        setError("username", {
          type: "manual",
          message: `Username "${usernameToValidate}" not found on BoardGameGeek`,
        });
      }
      setUsernameToValidate(null);
    }
  }, [
    usernameToValidate,
    isValidatingUsername,
    userData,
    validationError,
    addUsername,
    reset,
    clearErrors,
    setError,
  ]);

  const onSubmit = (data: FormData) => {
    const trimmedUsername = data.username.trim();

    if (!trimmedUsername) return;

    // Check if username already exists
    if (usernames.includes(trimmedUsername)) {
      setError("username", {
        type: "manual",
        message: "Username already added to the list",
      });
      return;
    }

    clearErrors("username");
    setUsernameToValidate(trimmedUsername);
  };

  const handleRemoveUsername = (usernameToRemove: string) => {
    removeUsername(usernameToRemove);
  };

  const handleSearch = () => {
    if (usernames.length === 0) {
      setError("username", {
        type: "manual",
        message: "Please add at least one username before searching",
      });
      return;
    }
    clearErrors();
    onSearch();
  };

  return (
    <VStack gap={4} w="full" maxW="2xl">
      {/* Username Input Form */}
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
        <VStack gap={4} w="full">
          <Box maxW="md">
            <HStack gap={2}>
              <Controller
                name="username"
                control={control}
                rules={{
                  required: "Username is required",
                  minLength: {
                    value: 2,
                    message: "Username must be at least 2 characters",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter BoardGameGeek username"
                    bg="gray.100"
                    border="none"
                    _focus={{
                      bg: "gray.200",
                      boxShadow: "none",
                    }}
                    flex={1}
                  />
                )}
              />
              <IconButton
                aria-label="Add Username"
                size="lg"
                colorPalette="green"
                type="submit"
                loading={isValidatingUsername}
                disabled={isValidatingUsername}
              >
                +
              </IconButton>
            </HStack>
            {errors.username && (
              <Box color="red.500" fontSize="sm" mt={2}>
                {errors.username.message}
              </Box>
            )}
          </Box>
        </VStack>
      </form>

      {/* Added Usernames */}
      {usernames.length > 0 && (
        <VStack gap={2} w="full">
          <Text fontSize="sm" fontWeight="bold" color="gray.700">
            Added Collectors ({usernames.length}):
          </Text>
          <Flex wrap="wrap" gap={2} justify="center">
            {usernames.map((username) => (
              <Badge
                key={username}
                colorPalette="blue"
                variant="solid"
                px={3}
                py={1}
                borderRadius="full"
              >
                <HStack gap={2}>
                  <Text>{username}</Text>
                  <IconButton
                    aria-label={`Remove ${username}`}
                    size="xs"
                    variant="ghost"
                    color="white"
                    onClick={() => handleRemoveUsername(username)}
                  >
                    ✕
                  </IconButton>
                </HStack>
              </Badge>
            ))}
          </Flex>
        </VStack>
      )}

      {/* Search Button */}
      <Button
        colorPalette="blue"
        size="lg"
        onClick={handleSearch}
        loading={isValidating}
        disabled={usernames.length === 0}
        maxW="md"
        w="full"
      >
        🔍{" "}
        {isValidating
          ? "Validating..."
          : `View ${usernames.length > 0 ? usernames.length : ""} Collection${
              usernames.length !== 1 ? "s" : ""
            }`}
      </Button>
    </VStack>
  );
};

export default UsernameForm;
