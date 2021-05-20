import React, { useMemo } from "react";
import axios from "axios";
import { Box, Button, Input, Stack } from "@chakra-ui/react";
import { GetServerSideProps, NextPage } from "next";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
  AuthAction,
} from "next-firebase-auth";
import FullPageLoader from "../components/Layout/FullPageLoader";
import { ParsedUrlQuery } from "querystring";

type MyAccountProps = {};

type FormValues = {
  firstName?: string;
  lastName?: string;
  email: string;
  bbgeekUsername?: string;
};

const MyAccount: NextPage<MyAccountProps> = () => {
  const AuthUser = useAuthUser();

  const defaultValues = useMemo(
    () => ({
      firstName: "",
      lastName: "",
      email: AuthUser.email,
      bbgeekUsername: "",
    }),
    [AuthUser]
  );
  const { register, handleSubmit } = useForm({
    defaultValues,
  });
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
  };

  return (
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
              placeholder="First name"
              bg={"gray.100"}
              border={0}
              color={"gray.500"}
              _placeholder={{
                color: "gray.500",
              }}
              {...register("firstName")}
            />
            <Input
              placeholder="Last name"
              bg={"gray.100"}
              border={0}
              color={"gray.500"}
              _placeholder={{
                color: "gray.500",
              }}
              {...register("lastName")}
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
              {...register("email", { required: true })}
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
              {...register("bbgeekUsername")}
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
  console.log(response.data);
  return {
    props: {
      user,
    },
  };
});

export default withAuthUser()(MyAccount);
