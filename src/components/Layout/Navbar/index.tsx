import { Box, Flex, HStack, IconButton, Link } from "@chakra-ui/react";

import Logo from "./Logo";

type NavbarProps = {
  openDrawer?: () => void;
  isOpenDrawer?: boolean;
  onMobileMenuOpen?: () => void;
  onMobileMenuClose?: () => void;
  isMobileMenuOpen?: boolean;
};

const Navbar: React.FC<NavbarProps> = ({ onMobileMenuOpen }) => {
  return (
    <Box
      position="sticky"
      top={0}
      zIndex={1000}
      width="100%"
      left={0}
      right={0}
    >
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
        width="100%"
      >
        <Logo />

        {/* Mobile Menu Button */}
        <IconButton
          onClick={onMobileMenuOpen}
          variant="ghost"
          aria-label="Open mobile menu"
          size="md"
          display={{ base: "flex", md: "none" }}
          ml="auto"
        >
          ☰
        </IconButton>

        {/* Desktop Navigation */}
        <HStack gap={8} ml="auto" display={{ base: "none", md: "flex" }}>
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
