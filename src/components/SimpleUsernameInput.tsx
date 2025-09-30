import { Button, HStack, Input, Text, VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";

interface SimpleUsernameInputProps {
  handleSubmit: (username: string) => void;
  isLoading: boolean;
}

export default function SimpleUsernameInput({
  handleSubmit,
  isLoading,
}: SimpleUsernameInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleFormSubmit = () => {
    const trimmedUsername = inputValue.trim();
    if (trimmedUsername) {
      handleSubmit(trimmedUsername);
      setInputValue(""); // Clear input after submission
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleFormSubmit();
    }
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
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            size="sm"
          />
          <Button
            onClick={handleFormSubmit}
            colorScheme="blue"
            size="sm"
            loading={isLoading}
            loadingText="Adding..."
            disabled={!inputValue.trim()}
          >
            <FiPlus />
          </Button>
        </HStack>
      </div>
    </VStack>
  );
}
