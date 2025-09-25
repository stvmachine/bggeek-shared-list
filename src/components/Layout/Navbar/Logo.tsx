import { Flex, HStack, Box, Image } from "@chakra-ui/react";
import { useRouter } from "next/router";

const Logo = () => {
  const router = useRouter();
  
  return (
    <Flex 
      flex={{ base: 1 }} 
      justify={{ base: "flex-start" }}
      alignItems="center"
      cursor="pointer"
      onClick={() => router.push('/')}
      h="100%"
    >
      <HStack gap={3} align="center" h="100%">
        <Image 
          src="/img/logo.svg" 
          alt="Shared Shelf"
          h={{ base: '45px', md: '55px' }}
          w="auto"
          objectFit="contain"
        />
        <Box 
          as="span" 
          fontSize={{ base: 'xl', md: '2xl' }} 
          fontWeight="bold"
          color="gray.800"
          display={{ base: 'none', md: 'block' }}
        >
          Shared Shelf
        </Box>
      </HStack>
    </Flex>
  );
};

export default Logo;
