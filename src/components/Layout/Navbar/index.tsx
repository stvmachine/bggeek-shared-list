import { Box, Button, Flex, HStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FiMenu } from "react-icons/fi";

import Logo from "./Logo";

type NavbarProps = {
  onMobileMenuOpen?: () => void;
};

const Navbar: React.FC<NavbarProps> = ({ onMobileMenuOpen }) => {
  const router = useRouter();
  
  // Helper function to navigate while preserving query parameters
  const navigateWithParams = (path: string) => {
    const currentQuery = router.query;
    router.push({
      pathname: path,
      query: currentQuery,
    });
  };

  return (
    <Box
      position="sticky"
      top={0}
      zIndex={1000}
      width="100%"
      left={0}
      right={0}
      backdropFilter="blur(10px)"
    >
      <Flex
        color="gray.600"
        bg="rgba(255, 255, 255, 0.8)"
        minH={"50px"}
        py={2}
        px={{ base: 3, md: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor="gray.200"
        align={"center"}
        width="100%"
        maxW="container.lg"
        mx="auto"
      >
        <Logo />

        {/* Desktop Navigation */}
        <HStack spacing={4} ml="auto" display={{ base: "none", md: "flex" }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateWithParams("/collection")}
            color="gray.600"
            _hover={{ color: "blue.500", bg: "blue.50" }}
          >
            Collections
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateWithParams("/game-night")}
            color="gray.600"
            _hover={{ color: "blue.500", bg: "blue.50" }}
          >
            🎲 Game Night
          </Button>
        </HStack>

        {/* Mobile Menu Button */}
        <Box
          as="button"
          onClick={onMobileMenuOpen}
          aria-label="Open mobile menu"
          display={{ base: "flex", md: "none" }}
          alignItems="center"
          justifyContent="center"
          ml="auto"
          p={2}
          rounded="md"
          color="gray.700"
          _hover={{
            bg: "gray.100",
            color: "gray.800",
          }}
          _active={{
            bg: "gray.200",
            color: "gray.900",
          }}
        >
          <FiMenu size="24px" />
        </Box>
      </Flex>
    </Box>
  );
};

export default Navbar;
