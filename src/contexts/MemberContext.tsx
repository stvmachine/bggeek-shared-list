import { createContext, ReactNode, useContext, useMemo } from "react";
import { getMemberColor, getMemberInitial } from "../utils/memberColors";

export interface MemberData {
  username: string;
  color: {
    bg: string;
    color: string;
  };
  initial: string;
}

interface MemberContextType {
  members: MemberData[];
  getMemberData: (username: string) => MemberData | undefined;
}

const MemberContext = createContext<MemberContextType | undefined>(undefined);

interface MemberProviderProps {
  children: ReactNode;
  usernames: string[];
}

export function MemberProvider({ children, usernames }: MemberProviderProps) {
  const members = useMemo(() => {
    return usernames.map((username) => ({
      username,
      color: getMemberColor(username),
      initial: getMemberInitial(username),
    }));
  }, [usernames]);

  const getMemberData = (username: string): MemberData | undefined => {
    return members.find((member) => member.username === username);
  };

  const value = useMemo(
    () => ({
      members,
      getMemberData,
    }),
    [members]
  );

  return (
    <MemberContext.Provider value={value}>{children}</MemberContext.Provider>
  );
}

export function useMembers() {
  const context = useContext(MemberContext);
  if (context === undefined) {
    throw new Error("useMembers must be used within a MemberProvider");
  }
  return context;
}
