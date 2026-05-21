import { createContext, useContext, useState, useCallback, useRef, useEffect, type ReactNode } from "react";
import type { ToastOptions, ToastVariant } from "./types";
import { DEFAULT_DURATION } from "./types";

type ToastContextValue = {
  show: (options: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const BORDER_COLORS: Record<ToastVariant, string> = {
  success: "#A3BE8C",
  error:   "#EE6B6B",
  info:    "#86B4D6",
};

function Toast({ message, variant }: { message: string; variant: ToastVariant }) {
  return (
    <box
      position="absolute"
      top={1}
      right={2}
      maxWidth={60}
      borderStyle="single"
      borderColor={BORDER_COLORS[variant]}
      paddingX={2}
      paddingY={1}
      backgroundColor="#0D0D12"
    >
      <text fg={BORDER_COLORS[variant]}>{message}</text>
    </box>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastOptions | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear pending timer on unmount to prevent setState on unmounted component
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const show = useCallback((options: ToastOptions) => {
    if (timerRef.current) clearTimeout(timerRef.current);

    setToast({ variant: "info", ...options });

    timerRef.current = setTimeout(() => {
      setToast(null);
      timerRef.current = null;
    }, options.duration ?? DEFAULT_DURATION);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {toast && <Toast message={toast.message} variant={toast.variant ?? "info"} />}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
