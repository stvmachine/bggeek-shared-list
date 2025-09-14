import React from "react";
import {
  Alert,
  AlertIcon,
  AlertDescription,
} from "@chakra-ui/react";

type ValidationAlertProps = {
  error: string;
  maxW?: string;
};

const ValidationAlert: React.FC<ValidationAlertProps> = ({ error, maxW = "md" }) => {
  console.log("ValidationAlert received error:", error);
  
  if (!error) return null;

  return (
    <Alert status="error" borderRadius="md" maxW={maxW}>
      <AlertIcon />
      <AlertDescription fontSize="sm">
        {error}
      </AlertDescription>
    </Alert>
  );
};

export default ValidationAlert;
