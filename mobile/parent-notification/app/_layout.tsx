import React from "react";
import { Platform } from "react-native";
import * as Device from "expo-device";
import { router, Slot } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { SessionProvider } from "@/contexts/auth-context";
import { StudentProvider } from "@/contexts/student-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider } from "@/contexts/theme-context";
import { I18nProvider } from "@/contexts/i18n-context";
import * as Notifications from "expo-notifications";
import { RootSiblingParent } from "react-native-root-siblings";
import { NetworkProvider } from "@/contexts/network-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    const { data } = await Notifications.getDevicePushTokenAsync();
    await AsyncStorage.setItem("expoPushToken", data);
    token = data;
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}

export const sendPushTokenToBackend = async (token: string) => {
  try {
    const sessionToken = await AsyncStorage.getItem("session");
    if (!sessionToken) {
      console.warn(
        "No session token found. Cannot send push token to backend.",
      );
      return;
    }

    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/device-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({ token: token }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to send push token:", errorData);
    } else {
      console.log("Push token sent successfully.");
    }
  } catch (error) {
    console.error("Error sending push token to backend:", error);
  }
};

export default function Root() {
  const notificationListener = React.useRef<Notifications.Subscription>();
  const responseListener = React.useRef<Notifications.Subscription>();
  React.useEffect(() => {
    const subscription = Notifications.addPushTokenListener(
      async (tokenInfo) => {
        const newToken = tokenInfo.data;
        await AsyncStorage.setItem("expoPushToken", newToken);

        // Send the new token to your backend
        await sendPushTokenToBackend(newToken);
      },
    );

    return () => {
      subscription.remove();
    };
  }, []);

  React.useEffect(() => {
    let isMounted = true;
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {});
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        redirect(response.notification);
      });
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (isMounted && response?.notification) {
        redirect(response.notification);
      }
    });
    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current,
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
      isMounted = false;
    };
  }, []);

  function redirect(notification: Notifications.Notification) {
    const url = notification.request.content.data?.url;
    if (url) {
      router.push(url);
    }
  }

  const queryClient = new QueryClient();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RootSiblingParent>
        <SQLiteProvider
          databaseName="maria.db"
          assetSource={{ assetId: require("../assets/database/maria.db") }}
        >
          <SessionProvider>
            <ThemeProvider>
              <NetworkProvider>
                <I18nProvider>
                  <QueryClientProvider client={queryClient}>
                    <StudentProvider>
                      <Slot />
                    </StudentProvider>
                  </QueryClientProvider>
                </I18nProvider>
              </NetworkProvider>
            </ThemeProvider>
          </SessionProvider>
        </SQLiteProvider>
      </RootSiblingParent>
    </GestureHandlerRootView>
  );
}
