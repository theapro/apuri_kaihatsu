import React from "react";
import { useStorageState } from "@/hooks/useStorageState";
import { router } from "expo-router";
import * as Notifications from "expo-notifications";
import { Session } from "@/constants/types";
import { useSQLiteContext } from "expo-sqlite";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-root-toast";
import { LogBox } from "react-native";

const AuthContext = React.createContext<{
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => void;
  session?: string | null;
  refreshToken: () => void;
  setSession: (session: string | null) => void;
  isLoading: boolean;
}>({
  signIn: () => new Promise(() => null),
  signOut: () => null,
  session: null,
  refreshToken: () => null,
  setSession: () => null,
  isLoading: false,
});

export function useSession() {
  const value = React.useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");
  const db = useSQLiteContext();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";
  const getExpoPushToken = async () => {
    try {
      const { data } = await Notifications.getDevicePushTokenAsync();
      if (data) {
        await AsyncStorage.setItem("expoPushToken", data);
      }
      return data;
    } catch (error) {
      console.error("Error getting push token:", error);
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signIn: async (email: string, password: string) => {
          await AsyncStorage.setItem("email", email);
          await AsyncStorage.setItem("password", password);
          try {
            const response = await fetch(`${apiUrl}/login`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email,
                password,
                token: "",
              }),
            });
            if (response.status === 403) {
              await AsyncStorage.setItem("email", email);
              await AsyncStorage.setItem("temp_password", password);
              return router.push("/new-psswd");
            }
            if (!response.ok) {
              const errorData = await response.json();
              Toast.show(`${errorData.error}`, {
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
              throw new Error(errorData.error || "Internal server error");
            }
            Toast.show("Logged in" /*i18n[language].loginSuccess*/, {
              duration: Toast.durations.SHORT,
              position: Toast.positions.BOTTOM,
              shadow: true,
              animation: true,
              hideOnPress: true,
              containerStyle: {
                backgroundColor: "#059669",
                borderRadius: 5,
              },
            });
            const data: Session = await response.json();
            setSession(data.access_token);
            await AsyncStorage.setItem("refresh_token", data.refresh_token);
            await db.runAsync(
              "INSERT INTO user (given_name, family_name, phone_number, email) VALUES ($given_name, $family_name, $phone_number, $email)",
              [
                data.user.given_name,
                data.user.family_name,
                data.user.phone_number,
                data.user.email,
              ],
            );
            router.replace("/");
          } catch (error) {
            if (error instanceof Error) {
              console.error(error.message);
            } else {
              console.error("An unknown error occurred");
            }
          }
        },
        refreshToken: async () => {
          try {
            const refreshToken = await AsyncStorage.getItem("refresh_token");
            if (!refreshToken) {
              throw new Error("No refresh token found");
            }

            const response = await fetch(`${apiUrl}/refresh-token`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                refresh_token: refreshToken,
              }),
            });
            if (!response.ok) {
              try {
                await db.execAsync("DELETE FROM user");
                await db.execAsync("DELETE FROM student");
                await db.execAsync("DELETE FROM message");
              } catch (error) {
                console.error("Error during sign out:", error);
              } finally {
                setSession(null);
              }
            }
            const data: Session = await response.json();
            setSession(data.access_token);
            await AsyncStorage.setItem("refresh_token", data.refresh_token);
          } catch (error) {
            console.error("Error refreshing token:", error);
          }
        },
        signOut: async () => {
          try {
            await db.execAsync("DELETE FROM user");
            await db.execAsync("DELETE FROM student");
            await db.execAsync("DELETE FROM message");
          } catch (error) {
            console.error("Error during sign out:", error);
          } finally {
            setSession(null);
          }
        },
        session,
        setSession,
        isLoading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
