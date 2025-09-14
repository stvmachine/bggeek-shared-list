import { AddIcon, CloseIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Badge,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
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
  usernames: string[];
  onUsernamesChange: (usernames: string[]) => void;
  onSearch: () => void;
  isValidating: boolean;
};

const UsernameForm: React.FC<UsernameFormProps> = ({
  usernames,
  onUsernamesChange,
  onSearch,
  isValidating,
}) => {
  const [usernameToValidate, setUsernameToValidate] = useState<string | null>(null);

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
  const { data: userData, isLoading: isValidatingUsername, error: validationError } = useQuery(
    ["validateUser", usernameToValidate],
    () => getBggUser({ name: usernameToValidate! }),
    {
      enabled: !!usernameToValidate,
      retry: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  // Handle validation result when query completes
  React.useEffect(() => {
    if (usernameToValidate && !isValidatingUsername) {
      if (userData?.data?.id) {
        // Username is valid, add it to the list
        onUsernamesChange([...usernames, usernameToValidate]);
        reset();
        clearErrors();
      } else if (validationError) {
        // Username validation failed
        setError("username", {
          type: "manual",
          message: `Username "${usernameToValidate}" not found on BoardGameGeek`,
        });
      }
      setUsernameToValidate(null);
    }
  }, [usernameToValidate, isValidatingUsername, userData, validationError, usernames, onUsernamesChange, reset, clearErrors, setError]);

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
    const newUsernames = usernames.filter((u) => u !== usernameToRemove);
    onUsernamesChange(newUsernames);
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
    <VStack spacing={4} w="full" maxW="2xl">
      {/* Username Input Form */}
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
        <VStack spacing={4} w="full">
          <FormControl isInvalid={!!errors.username} maxW="md">
            <InputGroup size="lg">
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
                  />
                )}
              />
              <InputRightElement>
                <IconButton
                  aria-label="Add Username"
                  icon={<AddIcon />}
                  size="sm"
                  colorScheme="green"
                  type="submit"
                  isLoading={isValidatingUsername}
                  isDisabled={isValidatingUsername}
                />
              </InputRightElement>
            </InputGroup>
            {errors.username && (
              <FormErrorMessage mt={2}>
                {errors.username.message}
              </FormErrorMessage>
            )}
          </FormControl>
        </VStack>
      </form>

      {/* Added Usernames */}
      {usernames.length > 0 && (
        <VStack spacing={2} w="full">
          <Text fontSize="sm" fontWeight="bold" color="gray.700">
            Added Collectors ({usernames.length}):
          </Text>
          <Flex wrap="wrap" gap={2} justify="center">
            {usernames.map((username) => (
              <Badge
                key={username}
                colorScheme="blue"
                variant="solid"
                px={3}
                py={1}
                borderRadius="full"
              >
                <HStack spacing={2}>
                  <Text>{username}</Text>
                  <IconButton
                    aria-label={`Remove ${username}`}
                    icon={<CloseIcon />}
                    size="xs"
                    variant="ghost"
                    color="white"
                    onClick={() => handleRemoveUsername(username)}
                  />
                </HStack>
              </Badge>
            ))}
          </Flex>
        </VStack>
      )}

      {/* Search Button */}
      <Button
        colorScheme="blue"
        size="lg"
        onClick={handleSearch}
        isLoading={isValidating}
        isDisabled={usernames.length === 0}
        leftIcon={<SearchIcon />}
        maxW="md"
        w="full"
      >
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
