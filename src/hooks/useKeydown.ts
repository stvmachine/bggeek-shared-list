import { useEffect, KeyboardEvent } from "react";

type useKeydownProps = {
  callback: () => void;
};

const useKeydown = ({ callback }: useKeydownProps) => {
  useEffect(() => {
    const listener: any = (event: KeyboardEvent) => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        event.preventDefault();
        callback();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, []);

  return;
};

export default useKeydown;
