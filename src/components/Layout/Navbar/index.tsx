import { Box, Flex, HStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FiMenu, FiShare2 } from "react-icons/fi";

import Logo from "./Logo";

type NavbarProps = {
  onMobileMenuOpen?: () => void;
};

const Navbar: React.FC<NavbarProps> = ({ onMobileMenuOpen }) => {
  const router = useRouter();
  const isHomepage = router.pathname === '/';
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
            color: "gray.800"
          }}
          _active={{
            bg: "gray.200",
            color: "gray.900"
          }}
        >
          <FiMenu size="24px" />
        </Box>

        <Box ml="auto" display={{ base: "none", md: "flex" }} alignItems="center">
          {!isHomepage && (
          <HStack gap={6} ml={6} display={{ base: "none", md: "flex" }}>
            <Box
              as="button"
              display="inline-flex"
              alignItems="center"
              justifyContent="center"
              px={3}
              py={1}
              ml={4}
              fontSize="sm"
              fontWeight="medium"
              color="blue.500"
              bg="white"
              border="1px solid"
              borderColor="blue.500"
              borderRadius="md"
              _hover={{
                bg: "blue.50"
              }}
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'My Board Game Collection',
                    text: 'Check out my board game collection!',
                    url: window.location.href,
                  }).catch(console.error);
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }
              }}
            >
              <Box as={FiShare2} mr={2} />
              Share Collection
            </Box>
          </HStack>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default Navbar;
