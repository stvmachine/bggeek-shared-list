import { Box, HStack, Text } from "@chakra-ui/react";

interface MemberAvatarProps {
  username: string;
  showUsername?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  spacing?: string;
}

// Simple color generation based on username
function getMemberColor(username: string) {
  const colors = [
    { bg: "blue.500", color: "white" },
    { bg: "green.500", color: "white" },
    { bg: "purple.500", color: "white" },
    { bg: "orange.500", color: "white" },
    { bg: "pink.500", color: "white" },
    { bg: "teal.500", color: "white" },
    { bg: "red.500", color: "white" },
    { bg: "yellow.500", color: "black" },
  ];

  const hash = username.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);

  return colors[Math.abs(hash) % colors.length];
}

function getMemberInitial(username: string) {
  return username.charAt(0).toUpperCase();
}

export function MemberAvatar({
  username,
  showUsername = true,
  size = "md",
  spacing = "2",
}: MemberAvatarProps) {
  const memberColor = getMemberColor(username);
  const initial = getMemberInitial(username);

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
