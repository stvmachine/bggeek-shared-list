import React, { useEffect, useRef, useCallback } from "react";
import { Input } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

interface SearchInputProps {
  placeholder?: string;
}

export const SearchInput = React.memo(
  ({ placeholder = "🔍 Search by game name..." }: SearchInputProps) => {
    const { setValue, watch } = useFormContext();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const searchValue = watch("keyword");

    // Handle input change
    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue("keyword", event.target.value);
      },
      [setValue]
    );

    // Maintain focus on the input when the value changes
    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, [searchValue]);

    return (
      <Input
        ref={inputRef}
        value={searchValue || ""}
        onChange={handleChange}
        placeholder={placeholder}
        size="md"
        borderRadius="xl"
        borderColor="gray.300"
        _focus={{
          borderColor: "blue.400",
          boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)",
        }}
        _hover={{ borderColor: "gray.400" }}
      />
    );
  }
);

SearchInput.displayName = "SearchInput";
