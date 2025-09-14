import React from "react";
import {
  Button,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

type SearchButtonProps = {
  usernames: string[];
  isValidating: boolean;
  onSearch: () => void;
  maxW?: string;
  w?: string;
};

const SearchButton: React.FC<SearchButtonProps> = ({
  usernames,
  isValidating,
  onSearch,
  maxW = "md",
  w = "full",
}) => {
  const getButtonText = () => {
    if (isValidating) return "Validating...";
    const count = usernames.length;
    return `View ${count > 0 ? count : ""} Collection${count !== 1 ? "s" : ""}`;
  };

  return (
    <Button
      colorScheme="blue"
      size="lg"
      onClick={onSearch}
      isLoading={isValidating}
      isDisabled={usernames.length === 0}
      leftIcon={<SearchIcon />}
      maxW={maxW}
      w={w}
    >
      {getButtonText()}
    </Button>
  );
};

export default SearchButton;
