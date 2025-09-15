import { Box, Flex, IconButton } from "@chakra-ui/react";
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
        bg="white"
        color="gray.600"
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor="gray.200"
        align={"center"}
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={openDrawer}
            children={isOpenDrawer ? "✕" : "☰"}
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
