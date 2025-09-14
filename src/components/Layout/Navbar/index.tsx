import { Box, Flex, IconButton, useColorModeValue } from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import Logo from "./Logo";

type NavbarProps = {
  openDrawer?: () => void;
  isOpenDrawer?: boolean;
};

const Navbar: React.FC<NavbarProps> = ({
  isOpenDrawer,
  openDrawer,
}) => {
  return (
    <Box width={"100%"}>
      <Flex
        bg={useColorModeValue("white", "gray.800")}
        color={useColorModeValue("gray.600", "white")}
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
        align={"center"}
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={openDrawer}
            icon={
              isOpenDrawer ? (
                <CloseIcon w={3} h={3} />
              ) : (
                <HamburgerIcon w={5} h={5} />
              )
            }
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>
        <Logo />
      </Flex>
    </Box>
  );
};

export default Navbar;
