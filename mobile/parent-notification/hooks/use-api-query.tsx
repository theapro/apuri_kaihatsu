import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/contexts/auth-context";
import { useNetwork } from "@/contexts/network-context";

export default function useApiQuery<T>(queryUrl: string, queryKey: unknown[]) {
  const { signOut, refreshToken, session } = useSession();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";
  return useQuery({
    queryKey,
    queryFn: async () => {
      const res = await fetch(`${apiUrl}/${queryUrl}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session}`,
        },
      });
      if (res.status === 401) {
        return refreshToken();
      } else if (res.status === 403) {
        return signOut();
      }
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }
      return (await res.json()) as T;
    },
    enabled: !!session,
  });
}
