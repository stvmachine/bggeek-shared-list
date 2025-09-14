import React from "react";
import {
  Avatar,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { AuthUser } from "next-firebase-auth";

type UserAvatarProps = {
  user: AuthUser & {
    bggUsername?: string;
    bggVerified?: boolean;
  };
  signOut?: () => void;
};

const UserAvatar: React.FC<UserAvatarProps> = ({ user, signOut }) => {
  const router = useRouter();
  const goTo = (route: string) => () => router.push(route);
  return (
    <Stack
      flex={{ base: 1, md: 0 }}
      justify={"flex-end"}
      direction={"row"}
      spacing={6}
    >
      {user?.email ? (
        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton
              as={Button}
              rounded={"full"}
              variant={"link"}
              cursor={"pointer"}
            >
              <Avatar
                size={"sm"}
                src={
                  user?.photoURL ||
                  "https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
                }
              />
            </MenuButton>
            <MenuList>
              <MenuItem onClick={goTo(`/my-account`)}>Settings</MenuItem>
              <MenuItem onClick={goTo(`/user/${user.id}/collection`)}>
                My collection
              </MenuItem>
              <MenuItem onClick={goTo(`/user/${user.id}/wishlist`)}>
                Wishlist
              </MenuItem>
              <MenuItem onClick={goTo(`/user/${user.id}/communities`)}>
                My groups
              </MenuItem>
              <MenuItem onClick={goTo(`/user/${user.id}/plays`)}>
                Plays
              </MenuItem>
              <MenuDivider />
              <MenuItem onClick={signOut}>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      ) : (
        <>
          <Button
            fontSize={"sm"}
            fontWeight={400}
            variant={"link"}
            onClick={goTo("/auth")}
          >
            Sign In
          </Button>
          <Button
            display={{ base: "none", md: "inline-flex" }}
            fontSize={"sm"}
            fontWeight={600}
            color={"white"}
            bg={"pink.400"}
            _hover={{
              bg: "pink.300",
            }}
            onClick={goTo("/register")}
          >
            Sign Up
          </Button>
        </>
      )}
    </Stack>
  );
};

export default UserAvatar;
