import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchTokens } from "../lib/api";

export function useTokenSearch(rawQuery: string) {
  const [debounced, setDebounced] = useState(rawQuery);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(rawQuery), 300);
    return () => clearTimeout(id);
  }, [rawQuery]);

  return useQuery({
    queryKey: ["token-search", debounced],
    queryFn: () => searchTokens(debounced),
    enabled: debounced.trim().length >= 2,
    staleTime: 60_000,
  });
}
