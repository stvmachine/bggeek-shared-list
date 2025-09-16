import React from "react";

import UsernameManager from "./UsernameManager";

type UsernameFormProps = {
  onSearch: (_usernames: string[]) => void;
  onValidatedUsernames?: (_usernames: string[]) => void;
  isValidating: boolean;
  noForm?: boolean; // Optional prop to render without form wrapper
};

const UsernameForm: React.FC<UsernameFormProps> = ({
  onSearch,
  onValidatedUsernames,
  noForm = false,
}) => {
  return (
    <UsernameManager
      onUsernamesChange={onSearch}
      onValidatedUsernames={onValidatedUsernames}
      noForm={noForm}
    />
  );
};

export default React.memo(UsernameForm);
