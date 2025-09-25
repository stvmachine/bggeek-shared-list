import { Box, Flex } from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";

import Logo from "./Logo";
import { useRouter } from "next/router";

type NavbarProps = {
  onMobileMenuOpen?: () => void;
};

const  Navbar : React.FC<NavbarProps> = ({ onMobileMenuOpen }) => {
  const router = useRouter();

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
