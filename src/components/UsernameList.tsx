import React from "react";
import {
  VStack,
  Text,
  Flex,
  Badge,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

type UsernameListProps = {
  usernames: string[];
  onRemoveUsername: (username: string) => void;
};

const UsernameList: React.FC<UsernameListProps> = ({
  usernames,
  onRemoveUsername,
}) => {
  if (usernames.length === 0) return null;

  return (
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
                onClick={() => onRemoveUsername(username)}
              />
            </HStack>
          </Badge>
        ))}
      </Flex>
    </VStack>
  );
};

export default UsernameList;
