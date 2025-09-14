import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  VStack,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Button,
  FormControl,
  FormErrorMessage,
  Text,
  Flex,
  Badge,
  HStack,
} from "@chakra-ui/react";
import { AddIcon, SearchIcon, CloseIcon } from "@chakra-ui/icons";
import { getBggUser } from "bgg-xml-api-client";

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
  const [isAddingUsername, setIsAddingUsername] = useState(false);
  
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

  const validateUsername = async (username: string): Promise<boolean> => {
    try {
      const user = await getBggUser({ name: username });
      return !!(user?.data?.id);
    } catch (error) {
      console.log(`Username "${username}" not found on BoardGameGeek`);
      return false;
    }
  };

  const onSubmit = async (data: FormData) => {
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

    setIsAddingUsername(true);
    clearErrors("username");

    try {
      const isValid = await validateUsername(trimmedUsername);
      
      if (isValid) {
        onUsernamesChange([...usernames, trimmedUsername]);
        reset();
        clearErrors();
      } else {
        setError("username", {
          type: "manual",
          message: `Username "${trimmedUsername}" not found on BoardGameGeek`,
        });
      }
    } catch (error) {
      setError("username", {
        type: "manual",
        message: `Error validating username "${trimmedUsername}"`,
      });
    } finally {
      setIsAddingUsername(false);
    }
  };

  const handleRemoveUsername = (usernameToRemove: string) => {
    const newUsernames = usernames.filter(u => u !== usernameToRemove);
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
                  isLoading={isAddingUsername}
                  isDisabled={isAddingUsername}
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
          : `View ${usernames.length > 0 ? usernames.length : ""} Collection${usernames.length !== 1 ? "s" : ""}`
        }
      </Button>
    </VStack>
  );
};

export default UsernameForm;
