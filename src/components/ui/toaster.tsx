"use client"

import {
  Toaster,
  createToaster,
  type CreateToasterReturn,
} from "@chakra-ui/react"

export const toaster : CreateToasterReturn= createToaster({
  placement: "bottom-end",
  pauseOnPageIdle: true,
})

export function AppToaster() {
  return <Toaster /> 
}