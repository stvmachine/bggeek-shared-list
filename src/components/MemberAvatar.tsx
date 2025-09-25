import { Box, HStack, Text } from "@chakra-ui/react";
import { useMembers } from "../contexts/MemberContext";

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
  const { getMemberData } = useMembers();
  const memberData = getMemberData(username);

  if (!memberData) return null;

  const sizeMap = {
    xs: { box: "18px", fontSize: "9px" }, // Slightly larger than before
    sm: { box: "20px", fontSize: "10px" }, // Increased from 16px
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
        bg={memberData.color.bg}
        color={memberData.color.color}
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontSize={fontSize}
        fontWeight="bold"
        flexShrink={0}
        flexGrow={0}
        lineHeight="1"
      >
        {memberData.initial}
      </Box>
      {showUsername && (
        <Text
          fontSize={size === "xs" ? "xs" : "sm"}
          color="gray.700"
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
          maxW={size === "xs" ? "80px" : "none"}
        >
          {username}
        </Text>
      )}
    </HStack>
  );

  return avatar;
}
