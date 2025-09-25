import { Flex, Image } from "@chakra-ui/react";
import { useRouter } from "next/router";

const Logo = () => {
  const router = useRouter();

  return (
    <Flex
      justify="flex-start"
      align="center"
      cursor="pointer"
      onClick={() => router.push("/")}
      h="100%"
      pl={{ base: 3, md: 4 }}
      flexShrink={0}
    >
      <Image
        src="/img/logo.svg"
        alt="Shared Shelf"
        h={{ base: "35px", md: "45px" }}
        w="auto"
        objectFit="contain"
      />
    </Flex>
  );
};

export default Logo;
