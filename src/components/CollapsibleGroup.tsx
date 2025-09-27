import {
  Badge,
  Box,
  Flex,
  Heading,
  IconButton,
  VStack,
} from "@chakra-ui/react";
import React from "react";

type CollapsibleGroupProps = {
  groupName: string;
  isCollapsed: boolean;
  onToggle: () => void;
  count?: number;
  children?: React.ReactNode;
};

const CollapsibleGroup: React.FC<CollapsibleGroupProps> = ({
  groupName,
  isCollapsed,
  onToggle,
  count = 0,
  children,
}) => {
  return (
    <Box
      border="1px solid"
      borderColor="gray.200"
      borderRadius="lg"
      p={4}
      bg="white"
      transition="all 0.2s"
      _hover={{
        borderColor: "gray.300",
        boxShadow: "sm",
      }}
    >
      <VStack align="stretch" gap={4}>
        <Flex align="center" gap={3}>
          <IconButton
            aria-label={isCollapsed ? "Expand group" : "Collapse group"}
            size="sm"
            variant="ghost"
            onClick={onToggle}
            _hover={{
              bg: "blue.50",
              color: "blue.600",
            }}
            fontSize="sm"
            minW="28px"
            h="28px"
            borderRadius="md"
            transition="all 0.2s"
          >
            {isCollapsed ? "▶" : "▼"}
          </IconButton>
          <Heading
            fontSize="lg"
            color="gray.700"
            flex="1"
            cursor="pointer"
            onClick={onToggle}
            _hover={{
              color: "blue.600",
            }}
            transition="color 0.2s"
          >
            {groupName}
          </Heading>
          <Badge
            colorScheme="blue"
            variant="outline"
            fontSize="sm"
            minW="24px"
            textAlign="center"
          >
            {count}
          </Badge>
        </Flex>

        {!isCollapsed && children}
      </VStack>
    </Box>
  );
};

export default CollapsibleGroup;
