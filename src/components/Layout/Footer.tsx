// import { ReactNode } from "react";
import { Box, Flex, Stack, Text } from "@chakra-ui/react";

const Footer = () => (
  <Flex
    as="footer"
    marginTop="8rem"
    width="100%"
    display="column"
    alignItems="center"
    justifyContent="space-between"
    bg="gray.50"
    color="gray.700"
  >
    <Box borderTopWidth={1} borderStyle={"solid"} borderColor="gray.200">
      <Stack
        maxW={"6xl"}
        py={4}
        direction={{ base: "column", md: "row" }}
        gap={4}
        justify={{ md: "space-between" }}
        align={{ md: "center" }}
        mx="auto"
        px={4}
      >
        <Text>© 2020 Made by stevmachine</Text>
      </Stack>
    </Box>
  </Flex>
);

export default Footer;
