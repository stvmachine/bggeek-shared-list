import React, { useState } from "react";
import {
  VStack,
} from "@chakra-ui/react";
import UsernameInput from "./UsernameInput";
import UsernameList from "./UsernameList";
import ValidationAlert from "./ValidationAlert";

type UsernameManagerProps = {
  usernames: string[];
  onUsernamesChange: (usernames: string[]) => void;
  onError: (error: string) => void;
  onValidating: (isValidating: boolean) => void;
};

const UsernameManager: React.FC<UsernameManagerProps> = ({
  usernames,
  onUsernamesChange,
  onError,
  onValidating,
}) => {
  const [validationError, setValidationError] = useState("");

  const handleUsernameAdded = (username: string) => {
    console.log("UsernameManager.handleUsernameAdded called with:", username);
    
    if (usernames.includes(username)) {
      const errorMsg = "Username already added";
      console.log("Username already exists, showing error:", errorMsg);
      setValidationError(errorMsg);
      onError(errorMsg);
      return;
    }
    
    console.log("Adding valid username:", username);
    onUsernamesChange([...usernames, username]);
    setValidationError("");
    onError("");
  };

  const handleRemoveUsername = (usernameToRemove: string) => {
    const newUsernames = usernames.filter(u => u !== usernameToRemove);
    onUsernamesChange(newUsernames);
    setValidationError("");
    onError("");
  };

  const handleError = (error: string) => {
    console.log("UsernameManager received error:", error);
    setValidationError(error);
    onError(error);
    // Clear error after 5 seconds
    setTimeout(() => {
      setValidationError("");
      onError("");
    }, 5000);
  };

  const clearError = () => {
    setValidationError("");
    onError("");
  };

  return (
    <VStack spacing={4} w="full">
      <UsernameInput
        onUsernameAdded={handleUsernameAdded}
        onError={handleError}
        onValidating={onValidating}
        onClearError={clearError}
      />
      
      <UsernameList
        usernames={usernames}
        onRemoveUsername={handleRemoveUsername}
      />
      
      {/* Debug info */}
      {validationError && (
        <div style={{ fontSize: '12px', color: 'red' }}>
          DEBUG: Error state = "{validationError}"
        </div>
      )}
      
      <ValidationAlert error={validationError} />
    </VStack>
  );
};

export default UsernameManager;
