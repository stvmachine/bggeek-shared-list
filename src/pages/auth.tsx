import React from "react";
import { withAuthUser, AuthAction } from "next-firebase-auth";
import FirebaseAuth from "../components/FirebaseAuth";
import {
  Flex,
  Heading,
  Link,
  Text,
  Box,
  Input,
  Button,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import Card from "../components/Card";

const Auth = () => {
  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      height="100vh"
      background="#909090"
    >
      <Card variant="rounded" width="45%">
        <Heading>Sign In</Heading>
        <Flex>
          <FirebaseAuth />
          <Flex flexDirection="column">
            <Box display="grid" gridGap={2} gridAutoFlow="row dense">
              <FormControl id="email">
                <FormLabel isRequired>Email address</FormLabel>
                <Input type="email" placeholder="yourname@mail.com" />
              </FormControl>

              <FormControl id="password">
                <FormLabel isRequired>Password</FormLabel>
                <Input type="password" placeholder="Password" />
              </FormControl>

              <Button type="submit" colorScheme="teal">
                Sign in
              </Button>
              <Link color="blue.500" to="/reset-password" fontSize="xs">
                Forgot Password
              </Link>
              <Text fontSize="xs">
                Don't have an account?{" "}
                <Link color="blue.500" to="/register">
                  Register
                </Link>{" "}
                now.
              </Text>
            </Box>
          </Flex>
        </Flex>
      </Card>
    </Flex>
  );
};
export default withAuthUser({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.RENDER,
})(Auth);
