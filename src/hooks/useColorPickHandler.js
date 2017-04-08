import { useCallback, useRef } from 'react';

const SINGLE_CLICK_DELAY_MS = 250;

export function useColorPickHandler(onActiveColor, onContrastForeground) {
  const clickTimerRef = useRef(null);

  const getHandlers = useCallback(
    (color) => ({
      onClick: () => {
        if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
        clickTimerRef.current = setTimeout(() => {
          clickTimerRef.current = null;
          onActiveColor(color);
        }, SINGLE_CLICK_DELAY_MS);
      },
      onDoubleClick: (event) => {
        event.preventDefault();
        if (clickTimerRef.current) {
          clearTimeout(clickTimerRef.current);
          clickTimerRef.current = null;
        }
        onContrastForeground(color.hex);
      },
    }),
    [onActiveColor, onContrastForeground]
  );

  return getHandlers;
}
