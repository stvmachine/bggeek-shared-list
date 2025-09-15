import { Box, BoxProps } from "@chakra-ui/react";

const Main = (props: BoxProps) => (
  <Box
    as="main"
    flex="1"
    width="100%"
    minH="calc(100vh - 140px)"
    {...props}
  />
);

export default Main;
