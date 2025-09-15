import { Flex, Image, Text, HStack } from "@chakra-ui/react";

const Logo = () => (
  <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
    <HStack spacing={3}>
      <Image 
        src="/img/dice-logo-red.png" 
        boxSize="35px" 
        alt="Dice Logo"
      />
      <Text
        fontSize="lg"
        fontWeight="bold"
        color="gray.800"
        display={{ base: "none", sm: "block" }}
      >
        SharedGameCollection
      </Text>
    </HStack>
  </Flex>
);

export default Logo;
