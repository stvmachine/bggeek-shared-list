import React from "react";
import {
  //   Link as ChakraLink,
  //   Text,
  //   Code,
  Wrap,
  WrapItem,
  Center,
  Image,
} from "@chakra-ui/react";

type CollectionProps = {
  collectionData: any;
};

type ItemType = {
  thumbnail: string;
};

const Collection = ({ collectionData }: CollectionProps) => {
  return (
    <Wrap>
      {collectionData.totalitems > 0 &&
        collectionData.item.map(({ thumbnail }: ItemType) => (
          <WrapItem>
            <Image
              boxSize="100px"
              objectFit="contain"
              src={thumbnail}
            />
          </WrapItem>
        ))}
    </Wrap>
  );
};

export default Collection;
