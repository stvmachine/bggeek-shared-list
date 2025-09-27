import React, { useEffect, useRef, useCallback } from "react";
import { Input, InputProps } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

interface SearchInputProps {
  placeholder?: string;
}

export const SearchInput = React.memo(
  ({ placeholder = "🔍 Search by game name..." }: SearchInputProps) => {
    const { register, watch } = useFormContext();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const searchValue = watch("keyword");

    // Register the field with react-hook-form
    const { ref: formRef, ...rest } = register("keyword");

    // Maintain focus on the input when the value changes
    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, [searchValue]);

    // Create a callback ref that handles both the form ref and our local ref
    const setRefs = useCallback(
      (element: HTMLInputElement | null) => {
        // Update the form ref
        formRef(element);
        // Update our local ref
        inputRef.current = element;
      },
      [formRef]
    );

    return (
      <Input
        {...(rest as InputProps)}
        ref={setRefs}
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
