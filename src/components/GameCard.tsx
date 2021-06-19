import React from "react";
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
  LinkBox,
  LinkOverlay,
} from "@chakra-ui/react";
import { IPlayer } from "../utils/types";

type GameCardProps = {
  image?: string;
  objectid: string;
  bgName: string;
  owners?: {
    username: string;
    status: any;
    collid: string;
  }[];
};

const GameCard: React.FC<GameCardProps> = ({
  image,
  objectid,
  bgName,
  owners,
}) => {
  return (
    <WrapItem w={["100%", "180px"]} h={["125px", "300px"]}>
      <Box
        w={["100%", "180px"]}
        h={["125px", "300px"]}
        bg={useColorModeValue("white", "gray.900")}
        boxShadow={"2xl"}
        rounded={"md"}
        p={6}
        display="flex"
        flexDirection={["row", "column"]}
      >
        <LinkBox w={["125px", "180px"]} h={["125px", "180px"]}>
          <LinkOverlay
            href={`https://boardgamegeek.com/boardgame/${objectid}`}
            isExternal
          >
            <Box
              w={["125px", "180px"]}
              h={["125px", "180px"]}
              bg={"gray.100"}
              mt={-6}
              mx={-6}
              mb={2}
              pos={"relative"}
            >
              {image ? (
                <Image src={image} layout={"fill"} objectFit="contain" />
              ) : (
                <Skeleton height="100%" width="100%" />
              )}
            </Box>
          </LinkOverlay>
        </LinkBox>

        <Box
          w="100%"
          ml={[8, 0]}
          display="flex"
          flexDirection="column"
          alignContent="space-between"
        >
          <Stack>
            <Text
              textTransform={"uppercase"}
              fontWeight={800}
              fontSize={["xx-small", "x-small"]}
              letterSpacing={0.85}
              break
              dangerouslySetInnerHTML={{ __html: bgName }}
            />
          </Stack>
          <Stack
            mt={6}
            direction={"row"}
            spacing={2}
            align={"center"}
          >
            <Wrap>
              {owners && (
                <>
                  {owners.slice(0, 6).map(({ username }, index) => (
                    <WrapItem key={index}>
                      <Avatar size="xs" name={username} />
                    </WrapItem>
                  ))}
                  {owners.length > 6 && (
                    <WrapItem>+{`${owners.length - 6}`}</WrapItem>
                  )}
                </>
              )}
            </Wrap>
          </Stack>
        </Box>
      </Box>
    </WrapItem>
  );
};

export default React.memo(GameCard);
