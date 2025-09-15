import { useCallback, useLayoutEffect, useRef } from "react";

const useClickOutside = (
  handleClickOutside: () => void
): { ref: React.RefObject<HTMLElement> } => {
  const ref = useRef<HTMLElement>(null);

  const onClickOutside = useCallback(
    (event: MouseEvent) => {
      if (ref && ref.current && !ref.current.contains(event.target as Node)) {
        event.stopPropagation();
        event.preventDefault();
        handleClickOutside();
      }
    },
    [handleClickOutside]
  );

  useLayoutEffect(() => {
    document.addEventListener("click", onClickOutside, true);

    return () => {
      document.removeEventListener("click", onClickOutside, true);
    };
  }, []);

  return {
    ref,
  };
};

export default useClickOutside;
