import {
  Avatar,
  Box,
  LinkBox,
  LinkOverlay,
  Skeleton,
  Stack,
  Text,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import Image from "next/image";
import React from "react";

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
    <WrapItem
      w={["100%", "180px"]}
      h={["125px", "300px"]}
      bg="white"
      boxShadow={"2xl"}
      rounded={"md"}
      p={6}
      display="flex"
      flexDirection={["row", "column"]}
    >
      <LinkBox w={["125px", "180px"]} h={["125px", "180px"]}>
        <LinkOverlay
          href={`https://boardgamegeek.com/boardgame/${objectid}`}
          target="_blank"
          rel="noopener noreferrer"
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
              <Image
                src={image}
                alt={bgName}
                layout={"fill"}
                objectFit="contain"
              />
            ) : (
              <Skeleton height="100%" width="100%" />
            )}
          </Box>
        </LinkOverlay>
      </LinkBox>

      <Box
        h="100%"
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
            wordBreak="break-word"
            dangerouslySetInnerHTML={{ __html: bgName }}
          />
        </Stack>
        <Stack mt="auto" direction={"row"} gap={2} align={"center"}>
          <Wrap>
            {owners && (
              <>
                {owners.slice(0, 6).map(({ username }, index) => (
                  <WrapItem key={index}>
                    <Avatar.Root size="xs">
                      <Avatar.Fallback>
                        {username.charAt(0).toUpperCase()}
                      </Avatar.Fallback>
                    </Avatar.Root>
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
    </WrapItem>
  );
};

export default React.memo(GameCard);
