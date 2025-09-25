import { Box, HStack, Link, Stack, Text } from "@chakra-ui/react";

const Footer = () => (
  <Box
    as="footer"
    mt="auto"
    width="100%"
    bg="white"
    borderTopWidth={1}
    borderStyle="solid"
    borderColor="gray.200"
  >
    <Stack
      maxW="6xl"
      py={8}
      direction={{ base: "column", md: "row" }}
      gap={4}
      justify={{ md: "space-between" }}
      align={{ md: "center" }}
      mx="auto"
      px={4}
    >
      <Text color="gray.600" fontSize="sm">
        © 2024 Shared Shelf - Made by stevmachine
      </Text>
      <HStack gap={6}>
        <Link
          href="https://boardgamegeek.com"
          target="_blank"
          rel="noopener noreferrer"
          color="blue.500"
          fontSize="sm"
          _hover={{ textDecoration: "underline" }}
        >
          BoardGameGeek
        </Link>
        <Link
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          color="blue.500"
          fontSize="sm"
          _hover={{ textDecoration: "underline" }}
        >
          GitHub
        </Link>
      </HStack>
    </Stack>
  </Box>
);

export default Footer;
