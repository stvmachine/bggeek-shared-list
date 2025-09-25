import { Box, Flex, HStack, IconButton, Link as ChakraLink } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";

import Logo from "./Logo";

type NavbarProps = {
  openDrawer?: () => void;
  isOpenDrawer?: boolean;
  onMobileMenuOpen?: () => void;
  onMobileMenuClose?: () => void;
  isMobileMenuOpen?: boolean;
};

const Navbar: React.FC<NavbarProps> = ({ onMobileMenuOpen }) => {
  const router = useRouter();
  const isActive = (path: string) => router.pathname === path;
  const isHomepage = router.pathname === '/';
  return (
    <Box
      position="sticky"
      top={0}
      zIndex={1000}
      width="100%"
      left={0}
      right={0}
      bg="transparent"
      backdropFilter="blur(10px)"
    >
      <Flex
        color="gray.600"
        bg="rgba(255, 255, 255, 0.8)"
        minH={"65px"}
        py={3}
        px={{ base: 4, md: 6 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor="gray.200"
        align={"center"}
        width="100%"
        maxW="container.lg"
        mx="auto"
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

        {/* Desktop Navigation - Only show on non-home pages */}
        {!isHomepage && (
          <HStack gap={6} ml={6} display={{ base: "none", md: "flex" }}>
            <Link href="/" passHref legacyBehavior>
              <ChakraLink
                px={3}
                py={2}
                rounded="md"
                fontSize="md"
                fontWeight="semibold"
                color={isActive("/") ? "blue.600" : "gray.700"}
                borderBottom={isActive("/") ? "2px solid" : "none"}
                borderColor="blue.500"
                _hover={{ 
                  color: "blue.500",
                  bg: "rgba(0, 0, 0, 0.05)",
                  textDecoration: "none"
                }}
              >
                Home
              </ChakraLink>
            </Link>
            <Link href="/collection" passHref legacyBehavior>
              <ChakraLink
                px={3}
                py={2}
                rounded="md"
                fontSize="md"
                fontWeight="semibold"
                color={isActive("/collection") ? "blue.600" : "gray.700"}
                borderBottom={isActive("/collection") ? "2px solid" : "none"}
                borderColor="blue.500"
                _hover={{ 
                  color: "blue.500",
                  bg: "rgba(0, 0, 0, 0.05)",
                  textDecoration: "none"
                }}
              >
                Collection
              </ChakraLink>
            </Link>
          </HStack>
        )}
      </Flex>
    </Box>
  );
};

export default Navbar;
