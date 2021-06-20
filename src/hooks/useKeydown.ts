import { useEffect, useCallback, KeyboardEvent } from "react";

const useKeydown = (callback: () => void) => {
  const listener: any = useCallback((event: KeyboardEvent): void => {
    if (event.code === "Enter" || event.code === "NumpadEnter") {
      event.preventDefault();
      callback();
    }
  },[callback]);

  useEffect(() => {
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, []);

  return;
};

export default useKeydown;
