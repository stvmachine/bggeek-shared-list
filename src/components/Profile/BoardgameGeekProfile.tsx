import React, { useMemo } from "react";
import axios from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import { AuthUser } from "next-firebase-auth";

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  useToast,
} from "@chakra-ui/react";

type BoardgameGeekProfileProps = {
  user: AuthUser & {
    bggUsername?: string;
    bggVerified?: boolean;
  };
};

type FormValues = {
  bggUsername: string;
};

const BoardgameGeekProfile = ({ user }: BoardgameGeekProfileProps) => {
  const toast = useToast();

  const initialValues = useMemo(
    () => ({
      bggUsername: user.bggUsername,
    }),
    [user]
  );

  const { register, handleSubmit } = useForm({
    defaultValues: initialValues,
  });

  const onSubmit: SubmitHandler<FormValues> = async (input) => {
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
      const response = await axios.patch(
        `/api/v1/user/${user.id}`,
        changedValues,
        { validateStatus: () => true }
      );

      if (response.status >= 200 && response.status < 300) {
        toast({
          title: `Changed data satisfactorily.`,
          status: "success",
          isClosable: true,
        });
      } else {
        toast({
          title: response.data?.error || "Unexpected error",
          status: "error",
          isClosable: true,
        });
      }
    }
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
            <FormControl id="email">
              <FormLabel>Boardgame Geek Username</FormLabel>
              <Input
                placeholder="Boardgame geek username"
                bg={"gray.100"}
                border={0}
                color={"gray.500"}
                _placeholder={{
                  color: "gray.500",
                }}
                {...register("bggUsername")}
              />
            </FormControl>
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

export default BoardgameGeekProfile;
