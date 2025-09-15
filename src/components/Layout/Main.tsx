import { Stack, StackProps } from "@chakra-ui/react";

const Main = (props: StackProps) => (
  <Stack
    gap="1.5rem"
    width="100%"
    maxWidth="48rem"
    pt="2rem"
    px="1rem"
    {...props}
  />
);

export default Main;
