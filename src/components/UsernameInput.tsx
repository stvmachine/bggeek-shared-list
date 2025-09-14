import React, { useState } from "react";
import {
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  HStack,
  Spinner,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { getBggUser } from "bgg-xml-api-client";

type UsernameInputProps = {
  onUsernameAdded: (username: string) => void;
  onError: (error: string) => void;
  onValidating: (isValidating: boolean) => void;
  onClearError?: () => void;
};

const UsernameInput: React.FC<UsernameInputProps> = ({
  onUsernameAdded,
  onError,
  onValidating,
  onClearError,
}) => {
  const [newUsername, setNewUsername] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  const validateUsername = async (username: string): Promise<boolean> => {
    try {
      const user = await getBggUser({ name: username });
      return !!(user?.data?.id);
    } catch (error) {
      console.log(`Username "${username}" not found on BoardGameGeek`);
      return false;
    }
  };

  const handleAddUsername = async () => {
    if (!newUsername.trim()) return;
    
    const trimmedUsername = newUsername.trim();
    console.log("Starting validation for:", trimmedUsername);
    setIsValidating(true);
    onValidating(true);

    try {
      const isValid = await validateUsername(trimmedUsername);
      console.log("Validation result for", trimmedUsername, ":", isValid);
      
      if (isValid) {
        onUsernameAdded(trimmedUsername);
        setNewUsername("");
        // Clear errors only on success
        if (onClearError) {
          onClearError();
        }
      } else {
        const errorMsg = `Username "${trimmedUsername}" not found on BoardGameGeek`;
        console.log("Validation failed, showing error:", errorMsg);
        onError(errorMsg);
      }
    } catch (error) {
      console.log("Validation error:", error);
      onError(`Error validating username "${trimmedUsername}"`);
    } finally {
      setIsValidating(false);
      onValidating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddUsername();
    }
  };

  return (
    <InputGroup size="lg" maxW="md">
      <Input
        placeholder="Enter BoardGameGeek username"
        value={newUsername}
        onChange={(e) => setNewUsername(e.target.value)}
        onKeyPress={handleKeyPress}
        bg="gray.100"
        border="none"
        _focus={{
          bg: "gray.200",
          boxShadow: "none"
        }}
      />
      <InputRightElement>
        <HStack spacing={2}>
          <IconButton
            aria-label="Add Username"
            icon={isValidating ? <Spinner size="sm" /> : <AddIcon />}
            size="sm"
            colorScheme="green"
            onClick={handleAddUsername}
            isLoading={isValidating}
            isDisabled={!newUsername.trim()}
          />
        </HStack>
      </InputRightElement>
    </InputGroup>
  );
};

export default UsernameInput;
