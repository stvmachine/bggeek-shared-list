import { Button, HStack, Input, Text, VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import toast from "react-hot-toast";
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
  isLoading = false,
}: SimpleUsernameInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim()) {
      return;
    }

    if (usernames.includes(inputValue.trim())) {
      toast.error("Username already added");
      return;
    }

    await toast.promise(async () => await onAddUsername(inputValue.trim()), {
      loading: "Validating username...",
      success: <b>Username added successfully!</b>,
      error: err => (
        <b>{err?.message || "Username not found on BoardGameGeek"}</b>
      ),
    });

    setInputValue("");
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
    </VStack>
  );
}
