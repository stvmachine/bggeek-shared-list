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
import React, { useState, useCallback } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { useQuery } from "react-query";

type FormData = {
  username: string;
};

type UsernameManagerProps = {
  onUsernamesChange: (usernames: string[]) => void;
  onValidatedUsernames?: (usernames: string[]) => void;
  initialUsernames?: string[];
  showRemoveAll?: boolean;
  onRemoveAll?: () => void;
  noForm?: boolean;
  hidePills?: boolean;
};

const UsernameManager: React.FC<UsernameManagerProps> = ({
  onUsernamesChange,
  onValidatedUsernames,
  initialUsernames = [],
  showRemoveAll = false,
  onRemoveAll,
  noForm = false,
  hidePills = false,
}) => {
  const [usernames, setUsernames] = useState<string[]>(initialUsernames);
  const [usernamesToValidate, setUsernamesToValidate] = useState<string[]>([]);

  const methods = useForm<FormData>({
    defaultValues: {
      username: "",
    },
  });

  const { handleSubmit, setError, clearErrors, reset } = methods;

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
        console.error("Validation error:", error);
      },
      onSuccess: (data) => {
        // Process validation results
        const validUsernames: string[] = [];
        const invalidUsernames: string[] = [];

        data.forEach((result) => {
          if (result.userData?.data?.id) {
            validUsernames.push(result.username);
          } else {
            invalidUsernames.push(result.username);
          }
        });

        // Add valid usernames to internal state only
        if (validUsernames.length > 0) {
          const newUsernames = [...usernames, ...validUsernames];
          setUsernames(newUsernames);
          // Notify parent of validated usernames
          if (onValidatedUsernames) {
            onValidatedUsernames(newUsernames);
          }
        }

        // Show errors for invalid usernames
        if (invalidUsernames.length > 0) {
          setError("username", {
            type: "manual",
            message: `Invalid usernames: ${invalidUsernames.join(", ")}`,
          });
        }

        // Clear validation queue
        setUsernamesToValidate([]);
        reset();
      },
    }
  );

  const onSubmit = (data: FormData) => {
    clearErrors();
    const inputUsernames = data.username
      .split(",")
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    if (inputUsernames.length === 0) {
      setError("username", {
        type: "manual",
        message: "Please enter at least one username",
      });
      return;
    }

    // Check for duplicates against already added usernames
    const duplicates = inputUsernames.filter((username) =>
      usernames.some(
        (existingUsername) =>
          existingUsername.toLowerCase() === username.toLowerCase()
      )
    );
    if (duplicates.length > 0) {
      setError("username", {
        type: "manual",
        message: `Already added: ${duplicates.join(", ")}`,
      });
      return;
    }

    // Add to validation queue
    setUsernamesToValidate(inputUsernames);
  };

  const handleRemoveUsername = useCallback(
    (usernameToRemove: string) => {
      const newUsernames = usernames.filter((u) => u !== usernameToRemove);
      setUsernames(newUsernames);
      onUsernamesChange(newUsernames);
    },
    [usernames, onUsernamesChange]
  );

  const handleRemoveAll = useCallback(() => {
    setUsernames([]);
    onUsernamesChange([]);
    if (onRemoveAll) {
      onRemoveAll();
    }
  }, [onUsernamesChange, onRemoveAll]);

  const handleFormSubmit = useCallback(() => {
    handleSubmit(onSubmit)();
  }, [handleSubmit, onSubmit]);

  const formContent = (
    <VStack gap={4} w="full">
      <Box maxW="md">
        <HStack gap={2}>
          <Controller
            name="username"
            control={methods.control}
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
                onKeyDown={(e) => {
                  if (e.key === "Enter" && noForm) {
                    e.preventDefault();
                    handleFormSubmit();
                  }
                }}
              />
            )}
          />
          <IconButton
            aria-label="Add Username"
            size="lg"
            colorPalette="green"
            type={noForm ? "button" : "submit"}
            onClick={noForm ? handleFormSubmit : undefined}
            loading={isValidatingAny}
            disabled={isValidatingAny}
          >
            +
          </IconButton>
        </HStack>
        {methods.formState.errors.username && (
          <Box color="red.500" fontSize="sm" mt={2}>
            {methods.formState.errors.username.message}
          </Box>
        )}
      </Box>
    </VStack>
  );

  return (
    <FormProvider {...methods}>
      <VStack gap={4} w="full" maxW="2xl">
        {/* Username Input Form */}
        {noForm ? (
          formContent
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
            {formContent}
          </form>
        )}

        {/* Added Usernames */}
        {!hidePills && usernames.length > 0 && (
          <VStack gap={2} w="full">
            <HStack gap={2} w="full" justify="space-between">
              <Text fontSize="sm" fontWeight="bold" color="gray.700">
                Added Collectors ({usernames.length}):
              </Text>
              {showRemoveAll && (
                <Button
                  size="xs"
                  variant="ghost"
                  color="red.500"
                  onClick={handleRemoveAll}
                >
                  Remove All
                </Button>
              )}
            </HStack>
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
                      {isValid && <Text>✓</Text>}
                      {validationError && <Text>✗</Text>}
                    </HStack>
                  </Badge>
                );
              })}
            </Flex>
          </VStack>
        )}
      </VStack>
    </FormProvider>
  );
};

export default React.memo(UsernameManager);
