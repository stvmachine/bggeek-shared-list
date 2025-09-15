import { Box, BoxProps } from '@chakra-ui/react'

export const Container = (props: BoxProps) => {
  return (
    <Box
      minH="100vh"
      bg="gray.50"
      color="gray.800"
      {...props}
    />
  )
}
