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

type FormData = {
  username: string;
};

type UsernameFormProps = {
  onSearch: (usernames: string[]) => void;
  isValidating: boolean;
};

const UsernameForm: React.FC<UsernameFormProps> = ({
  onSearch,
  isValidating,
}) => {
  const [usernames, setUsernames] = useState<string[]>([]);
  const [usernamesToValidate, setUsernamesToValidate] = useState<string[]>([]);

  const addUsername = (username: string) => {
    if (!usernames.includes(username)) {
      setUsernames(prev => [...prev, username]);
    }
  };

  const removeUsername = (username: string) => {
    setUsernames(prev => prev.filter(u => u !== username));
  };

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

  // Use a single query with all usernames to validate
  const { data: validationData, isLoading: isValidatingAny } = useQuery(
    ["validateUsers", usernamesToValidate],
    async () => {
      if (usernamesToValidate.length === 0) return [];

      // Validate all usernames in parallel
      const validationPromises = usernamesToValidate.map(async (username) => {
        try {
          const userData = await getBggUser({ name: username });
          return { username, userData, error: null };
        } catch (error) {
          return { username, userData: null, error };
        }
      });

      return Promise.all(validationPromises);
    },
    {
      enabled: usernamesToValidate.length > 0,
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

  // Handle validation results for each username
  React.useEffect(() => {
    if (!isValidatingAny && validationData && validationData.length > 0) {
      validationData.forEach(({ username, userData, error }) => {
        if (userData?.data?.id) {
          // Username is valid, add it to the list
          addUsername(username);
        } else if (error) {
          // Handle different types of errors
          const errorObj = error as any;
          let errorMessage = `Username "${username}" not found on BoardGameGeek`;

          if (
            errorObj?.response?.status === 404 ||
            errorObj?.message?.includes("404")
          ) {
            errorMessage = `Username "${username}" does not exist on BoardGameGeek`;
          } else if (
            errorObj?.code === "NETWORK_ERROR" ||
            errorObj?.message?.includes("network")
          ) {
            errorMessage = `Network error validating "${username}". Please check your connection and try again.`;
          } else if (errorObj?.response?.status >= 500) {
            errorMessage = `BoardGameGeek is temporarily unavailable while validating "${username}". Please try again later.`;
          }

          setError("username", {
            type: "manual",
            message: errorMessage,
          });
        } else if (!userData?.data?.id && username) {
          // No error but also no valid user data - treat as not found
          setError("username", {
            type: "manual",
            message: `Username "${username}" not found on BoardGameGeek`,
          });
        }
      });

      // Clear validation list when all validations are complete
      setUsernamesToValidate([]);
      reset();
      clearErrors();
    }
  }, [
    isValidatingAny,
    validationData,
    addUsername,
    reset,
    clearErrors,
    setError,
  ]);

  const onSubmit = (data: FormData) => {
    const input = data.username.trim();
    console.log("Form submitted with input:", input);

    if (!input) return;

    // Split by comma and clean up each username
    const usernamesToAdd = input
      .split(",")
      .map((username) => username.trim())
      .filter((username) => username.length > 0);

    if (usernamesToAdd.length === 0) {
      setError("username", {
        type: "manual",
        message: "Please enter at least one valid username",
      });
      return;
    }

    // Check for duplicates
    const duplicates = usernamesToAdd.filter((username) =>
      usernames.includes(username)
    );
    if (duplicates.length > 0) {
      setError("username", {
        type: "manual",
        message: `Username(s) already added: ${duplicates.join(", ")}`,
      });
      return;
    }

    // Start validation for all usernames
    clearErrors("username");
    setUsernamesToValidate(usernamesToAdd);
  };

  const handleRemoveUsername = (usernameToRemove: string) => {
    removeUsername(usernameToRemove);
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
                    placeholder="Enter BoardGameGeek username(s) - separate multiple with commas"
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
                loading={isValidatingAny}
                disabled={isValidatingAny}
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

      {/* Validation Loading States */}
      {usernamesToValidate.length > 0 && (
        <VStack gap={2} w="full">
          <Text fontSize="sm" color="gray.600" fontWeight="bold">
            Validating usernames:
          </Text>
          <Flex wrap="wrap" gap={2}>
            {usernamesToValidate.map((username) => {
              const result = validationData?.find(
                (r) => r.username === username
              );
              const isValidating = isValidatingAny;
              const validationError = result?.error;
              const isValid = result?.userData?.data?.id;

              return (
                <Badge
                  key={username}
                  colorPalette={
                    validationError
                      ? "red"
                      : isValid
                      ? "green"
                      : isValidating
                      ? "yellow"
                      : "gray"
                  }
                  variant="solid"
                  px={3}
                  py={1}
                  borderRadius="full"
                >
                  <HStack gap={2}>
                    <Text>{username}</Text>
                    {isValidating && <Text>⏳</Text>}
                    {validationError && <Text>❌</Text>}
                    {!isValidating && isValid && <Text>✅</Text>}
                  </HStack>
                </Badge>
              );
            })}
          </Flex>
        </VStack>
      )}

      {/* Search Button */}
      <Button
        colorPalette="blue"
        size="lg"
        onClick={() => {
          if (usernames.length === 0) {
            setError("username", {
              type: "manual",
              message: "Please add at least one username before searching",
            });
            return;
          }
          clearErrors();
          onSearch(usernames);
        }}
        loading={isValidating || isValidatingAny}
        disabled={usernames.length === 0 || isValidatingAny}
        maxW="md"
        w="full"
      >
        🔍{" "}
        {isValidating || isValidatingAny
          ? "Validating..."
          : `View ${usernames.length > 0 ? usernames.length : ""} Collection${
              usernames.length !== 1 ? "s" : ""
            }`}
      </Button>
    </VStack>
  );
};

export default UsernameForm;
