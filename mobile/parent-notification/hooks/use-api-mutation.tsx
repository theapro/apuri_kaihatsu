import { useSession } from "@/contexts/auth-context";
import { MutationOptions, useMutation } from "@tanstack/react-query";
import Toast from "react-native-root-toast";

export default function useApiMutation<T>(
  mutationUrl: string,
  method: string,
  mutationKey: unknown[],
  options: MutationOptions<T, Error, any, unknown> = {},
) {
  const { session, signOut, refreshToken } = useSession();

  return useMutation<T>({
    mutationKey,
    mutationFn: async (data: any = {}): Promise<T> => {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/${mutationUrl}`,
        {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session}`,
          },
          body: JSON.stringify(data),
        },
      );
      if (res.status === 401) {
        refreshToken();
        throw new Error("Unauthorized. Token refreshed, please retry.");
      } else if (res.status === 403) {
        signOut();
        throw new Error("Forbidden. You have been signed out.");
      }
      return (await res.json()) as T;
    },
    onError: (error) => {
      Toast.show(`${error}`, {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        containerStyle: {
          backgroundColor: "#ff0000",
          borderRadius: 5,
        },
      });
    },
    ...options,
  });
}
