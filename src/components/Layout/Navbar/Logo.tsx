import React from "react";
import {
  Flex,
  Image,
  Text,
  useColorModeValue,
  useBreakpointValue,
} from "@chakra-ui/react";

const Logo = () => (
    <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
      <Text
        textAlign={useBreakpointValue({ base: "center", md: "left" })}
        fontFamily={"heading"}
        color={useColorModeValue("gray.800", "white")}
      >
        <Image src="/img/dice-logo-red.png" boxSize="35px" />
      </Text>
    </Flex>
  )

export default Logo;
