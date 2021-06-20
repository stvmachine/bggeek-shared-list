import { useRef, useCallback, useLayoutEffect } from "react";

const useClickOutside = (
  handleClickOutside: () => void
): { ref: React.RefObject<HTMLElement> } => {
  const ref = useRef<HTMLElement>(null);

  const onClickOutside = useCallback(
    (event) => {
      if (ref && ref.current && !ref.current.contains(event.target)) {
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
