import { Box, Flex, HStack, Link } from "@chakra-ui/react";
import Logo from "./Logo";

type NavbarProps = {
  openDrawer?: () => void;
  isOpenDrawer?: boolean;
};

const Navbar: React.FC<NavbarProps> = () => {
  return (
    <Box width={"100%"} position="sticky" top={0} zIndex={1000}>
      <Flex
        bg="white"
        color="gray.600"
        minH={"70px"}
        py={{ base: 3 }}
        px={{ base: 4, md: 6 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor="gray.200"
        align={"center"}
        boxShadow="sm"
      >
        <Logo />
        
        {/* Desktop Navigation */}
        <HStack 
          gap={8} 
          ml="auto" 
          display={{ base: "none", md: "flex" }}
        >
          <Link 
            href="/" 
            fontSize="md" 
            fontWeight="medium"
            color="gray.600"
            _hover={{ color: "blue.500" }}
          >
            Home
          </Link>
          <Link 
            href="/collection" 
            fontSize="md" 
            fontWeight="medium"
            color="gray.600"
            _hover={{ color: "blue.500" }}
          >
            Collection
          </Link>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navbar;
