import { Box, HStack, Text } from "@chakra-ui/react";
import { useUsernameColor } from "../contexts/UsernameColorContext";

interface MemberAvatarProps {
  username: string;
  showUsername?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  spacing?: string;
}

export function MemberAvatar({
  username,
  showUsername = true,
  size = "md",
  spacing = "2",
}: MemberAvatarProps) {
  const { getUsernameColor } = useUsernameColor();
  const memberColor = getUsernameColor(username);
  const initial = username.charAt(0).toUpperCase();

  const sizeMap = {
    xs: { box: "18px", fontSize: "9px" },
    sm: { box: "20px", fontSize: "10px" },
    md: { box: "24px", fontSize: "12px" },
    lg: { box: "32px", fontSize: "16px" },
  };

  const { box, fontSize } = sizeMap[size];

  const avatar = (
    <HStack spacing={spacing} alignItems="center">
      <Box
        width={box}
        height={box}
        borderRadius="full"
        bg={memberColor.bg}
        color={memberColor.color}
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontSize={fontSize}
        fontWeight="bold"
        flexShrink={0}
        title={username}
      >
        {initial}
      </Box>
      {showUsername && (
        <Text fontSize="sm" fontWeight="medium" color="gray.700">
          {username}
        </Text>
      )}
    </HStack>
  );

  return avatar;
}
