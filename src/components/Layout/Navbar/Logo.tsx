import { Flex, Image, Text, useBreakpointValue } from "@chakra-ui/react";

const Logo = () => (
  <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
    <Text
      textAlign={useBreakpointValue({ base: "center", md: "left" })}
      fontFamily={"heading"}
      color="gray.800"
    >
      <Image src="/img/dice-logo-red.png" boxSize="35px" />
    </Text>
  </Flex>
);

export default Logo;
