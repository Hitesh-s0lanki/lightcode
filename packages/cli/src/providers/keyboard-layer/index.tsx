import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from "react";

type KeyboardLayerContextValue = {
  push: (id: string) => void;
  pop: (id: string) => void;
  isTopLayer: (id: string) => boolean;
};

const KeyboardLayerContext = createContext<KeyboardLayerContextValue | null>(null);

export function KeyboardLayerProvider({ children }: { children: ReactNode }) {
  const [stack, setStack] = useState<string[]>(["base"]);

  const push = useCallback((id: string) => {
    setStack((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const pop = useCallback((id: string) => {
    setStack((prev) => prev.filter((item) => item !== id));
  }, []);

  const isTopLayer = useCallback(
    (id: string) => stack[stack.length - 1] === id,
    [stack],
  );

  return (
    <KeyboardLayerContext.Provider value={{ push, pop, isTopLayer }}>
      {children}
    </KeyboardLayerContext.Provider>
  );
}

export function useKeyboardLayer() {
  const ctx = useContext(KeyboardLayerContext);
  if (!ctx) throw new Error("useKeyboardLayer must be used within KeyboardLayerProvider");
  return ctx;
}
