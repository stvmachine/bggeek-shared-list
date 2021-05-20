import Image from "next/image";
import {
  Avatar,
  Box,
  Center,
  Heading,
  Stack,
  Skeleton,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

type GameCardProps = {
  image?: string;
};

export default function GameCard({ image }: GameCardProps) {
  return (
    <Center py={6}>
      <Box
        maxW={"300px"}
        w={"full"}
        bg={useColorModeValue("white", "gray.900")}
        boxShadow={"2xl"}
        rounded={"md"}
        p={6}
        overflow={"hidden"}
      >
        <Box
          h={"200px"}
          bg={"gray.100"}
          mt={-6}
          mx={-6}
          mb={6}
          pos={"relative"}
        >
          {image ? (
            <Image src={image} layout={"fill"} />
          ) : (
            <Skeleton height="100%" width="100%" />
          )}
        </Box>
        <Stack>
          <Text
            color={"green.500"}
            textTransform={"uppercase"}
            fontWeight={800}
            fontSize={"sm"}
            letterSpacing={1.1}
          >
            Blog
          </Text>
          <Heading
            color={useColorModeValue("gray.700", "white")}
            fontSize={"2xl"}
            fontFamily={"body"}
          >
            Boost your conversion rate
          </Heading>
          <Text color={"gray.500"}>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
            erat, sed diam voluptua. At vero eos et accusam et justo duo dolores
            et ea rebum.
          </Text>
        </Stack>
        <Stack mt={6} direction={"row"} spacing={4} align={"center"}>
          <Avatar
            src={"https://avatars0.githubusercontent.com/u/1164541?v=4"}
            alt={"Author"}
          />
          <Stack direction={"column"} spacing={0} fontSize={"sm"}>
            <Text fontWeight={600}>Achim Rolle</Text>
            <Text color={"gray.500"}>Feb 08, 2021 · 6min read</Text>
          </Stack>
        </Stack>
      </Box>
    </Center>
  );
}
