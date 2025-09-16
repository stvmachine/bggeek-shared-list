import { Box, Button } from "@chakra-ui/react";
import React from "react";

import { ICollection } from "../utils/types";

import SearchSidebar from "./SearchSidebar";

type MobileDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  members: string[];
  collections: ICollection[];
  onSearch: (_usernames: string[]) => void;
  onValidatedUsernames?: (_usernames: string[]) => void;
  onValidationError?: () => void;
  removeMember?: (_member: string) => void;
  removeAllMembers?: () => void;
  isValidating?: boolean;
  pendingUsernames?: string[];
  title?: string;
  width?: string;
};

const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  members,
  collections,
  onSearch,
  onValidatedUsernames,
  onValidationError,
  removeMember,
  removeAllMembers,
  isValidating,
  pendingUsernames,
  title = "Filters & Members",
  width = "320px",
}) => {
  if (!isOpen) return null;

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="blackAlpha.600"
      zIndex={1000}
      onClick={onClose}
    >
      <Box
        position="absolute"
        top={0}
        left={0}
        bottom={0}
        width={width}
        bg="white"
        shadow="xl"
        onClick={e => e.stopPropagation()}
      >
        <Box p={4} borderBottom="1px" borderColor="gray.200">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box fontWeight="bold" fontSize="lg">
              {title}
            </Box>
            <Button size="sm" variant="ghost" onClick={onClose}>
              ✕
            </Button>
          </Box>
        </Box>
        <Box p={0}>
          <SearchSidebar
            members={members}
            onSearch={onSearch}
            onValidatedUsernames={onValidatedUsernames}
            onValidationError={onValidationError}
            removeMember={removeMember}
            removeAllMembers={removeAllMembers}
            collections={collections}
            isValidating={isValidating}
            pendingUsernames={pendingUsernames}
            isOpenDrawer={true}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default MobileDrawer;
