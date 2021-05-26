import React, { useMemo } from "react";
import axios from "axios";
import { Box, Button, Container, Input, Stack } from "@chakra-ui/react";
import { NextPage } from "next";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  withAuthUser,
  withAuthUserTokenSSR,
  AuthAction,
  AuthUser,
  useAuthUser,
} from "next-firebase-auth";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";

type MyAccountProps = {
  user: AuthUser & {
    bggeekUsername: string;
    bggeekVerified: boolean;
  };
};

type FormValues = {
  displayName: string;
  email: string;
  bggeekUsername: string;
};

const MyAccount: NextPage<MyAccountProps> = ({ user }) => {
  const AuthUser = useAuthUser();

  const initialValues = useMemo(
    () => ({
      displayName: user.displayName,
      email: user.email,
      bggeekUsername: user.bggeekUsername,
    }),
    [user]
  );

  const { register, handleSubmit } = useForm({
    defaultValues: initialValues,
  });
  const onSubmit: SubmitHandler<FormValues> = (input) => {
    const changedValues = (
      Object.keys(input) as Array<keyof typeof input>
    ).reduce<Record<string, string>>((accum, key) => {
      if (initialValues[key] !== input[key] && !["email"].includes(key)) {
        accum[key] = input[key];
      }
      return accum;
    }, {});

    if (
      !(
        Object.keys(changedValues).length === 0 &&
        changedValues.constructor === Object
      )
    ) {
      axios.patch(`/api/v1/user/${user.id}`, changedValues);
    }
  };

  return (
    <Container height="100vh" maxWidth="100%">
      <Navbar user={AuthUser} signOut={AuthUser.signOut} />
      <Box mt={12}>
        <Stack
          bg={"gray.50"}
          rounded={"xl"}
          p={{ base: 4, sm: 6, md: 8 }}
          spacing={{ base: 8 }}
          maxW={{ lg: "lg" }}
        >
          <Box mt={10}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={4}>
                <Input
                  placeholder="Display Name"
                  bg={"gray.100"}
                  border={0}
                  color={"gray.500"}
                  _placeholder={{
                    color: "gray.500",
                  }}
                  {...register("displayName")}
                />
                <Input
                  placeholder="firstname@lastname.io"
                  bg={"gray.100"}
                  border={0}
                  color={"gray.500"}
                  _placeholder={{
                    color: "gray.500",
                  }}
                  type="email"
                  {...register("email")}
                  isDisabled
                />
                <Input
                  placeholder="Boardgame geek name"
                  bg={"gray.100"}
                  border={0}
                  color={"gray.500"}
                  _placeholder={{
                    color: "gray.500",
                  }}
                  {...register("bggeekUsername")}
                />
              </Stack>
              <Button
                fontFamily={"heading"}
                mt={8}
                w={"full"}
                bgGradient="linear(to-r, red.400,pink.400)"
                color={"white"}
                _hover={{
                  bgGradient: "linear(to-r, red.400,pink.400)",
                  boxShadow: "xl",
                }}
                type="submit"
              >
                Update
              </Button>
            </form>
          </Box>
        </Stack>
      </Box>
      <Footer />
    </Container>
  );
};

const API_HOST = `http://localhost:3001`;
export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser }) => {
  const token = await AuthUser.getIdToken();
  const response = await axios.get(`${API_HOST}/api/v1/user/account-options`, {
    headers: {
      Authorization: token,
    },
  });
  const { user } = response.data;
  return {
    props: {
      user,
    },
  };
});

export default withAuthUser<MyAccountProps>({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(MyAccount);
