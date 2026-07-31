import { useEffect } from "react";
import { playClickSound } from "../lib/sound";

/** Plays a satisfying click sound on every button press app-wide, via event delegation — no need to touch individual buttons. */
export function useGlobalClickSound(): void {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const button = target.closest("button");
      if (button && !button.disabled) playClickSound();
    }
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);
}
