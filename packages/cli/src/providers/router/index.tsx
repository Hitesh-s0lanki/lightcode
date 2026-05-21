import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export type AppRoute = "/" | "/sessions/new" | `/sessions/${string}`;

interface Location {
  route: AppRoute;
  params: Record<string, string>;
  state: Record<string, unknown>;
}

interface RouterContextValue {
  location: Location;
  navigate: (
    route: AppRoute,
    opts?: { state?: Record<string, unknown>; replace?: boolean },
  ) => void;
}

const RouterContext = createContext<RouterContextValue | null>(null);

export function RouterProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<Location>({
    route: "/",
    params: {},
    state: {},
  });

  const navigate = useCallback(
    (route: AppRoute, opts?: { state?: Record<string, unknown> }) => {
      const params: Record<string, string> = {};
      // Extract :id from /sessions/:id
      const sessionMatch = route.match(/^\/sessions\/(.+)$/);
      if (sessionMatch?.[1] && sessionMatch[1] !== "new") {
        params["id"] = sessionMatch[1];
      }
      setLocation({ route, params, state: opts?.state ?? {} });
    },
    [],
  );

  return (
    <RouterContext.Provider value={{ location, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error("useRouter must be used within RouterProvider");
  return ctx;
}

export function useNavigate() {
  return useRouter().navigate;
}

export function useLocation() {
  return useRouter().location;
}

export function useParams<T extends Record<string, string>>(): T {
  return useRouter().location.params as T;
}

export function useLocationState<T extends Record<string, unknown>>(): T {
  return useRouter().location.state as T;
}
