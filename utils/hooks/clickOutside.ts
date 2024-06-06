import { useEffect, useCallback } from "preact/hooks";

const useClickOutside = (node: HTMLElement, handler: () => void) => {
	const handleClick = useCallback((event: MouseEvent) => {
    node && !node.contains(event.target as HTMLElement) && !event.defaultPrevented && handler && handler();
  }, [node, handler]);

  useEffect(() => {
    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true)
    }
  }, [node, handleClick]);
};

export { useClickOutside }