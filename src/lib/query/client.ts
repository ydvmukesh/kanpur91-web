import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "@/lib/api/client";

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: false,
        retry: (count, err) => count < 1 && !(err instanceof ApiError && err.status === 401),
      },
      mutations: {
        retry: 0,
      },
    },
  });
}
