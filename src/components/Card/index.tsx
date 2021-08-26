import { Box, BoxProps, useStyleConfig } from "@chakra-ui/react";
import { CardVariants } from "./style";

interface Props extends BoxProps {
  variant: CardVariants;
}

const Card: React.FC<Props> = ({ variant, children, ...rest }) => {
  const styles = useStyleConfig("Card", { variant });
  // Pass the computed styles into the `__css` prop
  return (
    <Box __css={styles} {...rest}>
      {children}
    </Box>
  );
};

export default Card;
