import Image from "next/image";
import {
  Avatar,
  Box,
  Center,
  Heading,
  Stack,
  Skeleton,
  Text,
  Wrap,
  WrapItem,
  useColorModeValue,
} from "@chakra-ui/react";
import { IPlayer } from "../utils/types";

type GameCardProps = {
  image?: string;
  location: string;
  date: string;
  bgName: string;
  players: IPlayer[];
};

export default function GameCard({
  image,
  location,
  date,
  bgName,
  players,
}: GameCardProps) {
  return (
    <Center py={[2, 6]}>
      <Box
        maxW={["180px", "240px", "300px"]}
        w={"full"}
        bg={useColorModeValue("white", "gray.900")}
        boxShadow={"2xl"}
        rounded={"md"}
        p={6}
        overflow={"hidden"}
      >
        <Box
          h={["150px", "200px"]}
          bg={"gray.100"}
          mt={-6}
          mx={-6}
          mb={6}
          pos={"relative"}
        >
          {image ? (
            <Image src={image} layout={"fill"} objectFit="contain" />
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
            {bgName}
          </Text>
          <Heading
            color={useColorModeValue("gray.700", "white")}
            fontSize={["md", "2xl"]}
            fontFamily={"body"}
          >
            {location}
          </Heading>
          <Text color={"gray.500"}>{date}</Text>
        </Stack>
        <Stack mt={6} direction={"row"} spacing={2} align={"center"}>
          <Wrap>
            {players && (
              <>
                {players.slice(0, 6).map(({ name }, index) => (
                  <WrapItem key={index}>
                    <Avatar
                      size="xs"
                      name={name.includes("Anonymous player") ? "" : name}
                    />
                  </WrapItem>
                ))}
                {players.length > 6 && (
                  <WrapItem>+{`${players.length - 6}`}</WrapItem>
                )}
              </>
            )}
          </Wrap>
        </Stack>
      </Box>
    </Center>
  );
}
