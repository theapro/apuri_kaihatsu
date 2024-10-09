import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Keyboard,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Separator } from "@/components/atomic/separator";
import { useSQLiteContext } from "expo-sqlite";
import { useSession } from "@/contexts/auth-context";
import { Message, Student } from "@/constants/types";
import { StudentSelector } from "@/components/StudentSelector";
import { useStudents } from "@/contexts/student-context";
import { useNetwork } from "@/contexts/network-context";
import { useInfiniteQuery } from "@tanstack/react-query";
import Card from "@/components/card";
import { ThemedText } from "@/components/ThemedText";
import Button from "@/components/atomic/button";
import { I18nContext } from "@/contexts/i18n-context";
import {
  fetchMessagesFromDB,
  fetchReadButNotSentMessages,
  saveMessagesToDB,
} from "@/utils/queries";
import AsyncStorage from "@react-native-async-storage/async-storage";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

function HomeScreen() {
  const { signOut, refreshToken, session } = useSession();
  const { language, i18n } = useContext(I18nContext);
  const { isOnline } = useNetwork();
  const { students } = useStudents();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";
  const db = useSQLiteContext();
  const [activeStudent, setActiveStudent] = useState<Student | undefined>();
  const [refreshing, setRefreshing] = useState(false);
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [offlineLoading, setOfflineLoading] = useState(false);
  const readButNotSentMessageIDs = useRef<number[]>([]);
  useEffect(() => {
    if (students) {
      setActiveStudent(students[0]);
    }
  }, [students]);

  useEffect(() => {
    const fetchData = async () => {
      if (!isOnline && activeStudent) {
        setOfflineLoading(true);
        try {
          const messages = await fetchMessagesFromDB(
            db,
            activeStudent.student_number,
          );
          setLocalMessages(messages);
        } catch (error) {
          console.error("Error fetching messages from DB:", error);
        } finally {
          setOfflineLoading(false);
        }
      }

      if (isOnline && activeStudent) {
        try {
          readButNotSentMessageIDs.current = await fetchReadButNotSentMessages(
            db,
            activeStudent.student_number,
          );
          refetch();
        } catch (error) {
          console.error("Error fetching read but not sent messages:", error);
        }
      }
    };

    fetchData();
  }, [isOnline, activeStudent]);

  const fetchNextOfflineMessages = async () => {
    if (activeStudent) {
      const newMessages = await fetchMessagesFromDB(
        db,
        activeStudent.student_number,
        localMessages.length,
      );
      setLocalMessages((prevMessages) => [...prevMessages, ...newMessages]);
    }
  };

  const fetchMessagesFromAPI = async ({ pageParam = 0 }) => {
    if (activeStudent) {
      try {
        const response = await fetch(`${apiUrl}/posts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session}`,
          },
          body: JSON.stringify({
            student_id: activeStudent?.id,
            last_post_id: pageParam,
            read_post_ids: readButNotSentMessageIDs.current,
          }),
        });

        if (response.status === 401) {
          return refreshToken();
        } else if (response.status === 403) {
          return signOut();
        }

        const data = await response.json();
        await saveMessagesToDB(
          db,
          data.posts,
          activeStudent!.student_number,
          activeStudent!.id,
        );
        const updateQuery =
          "UPDATE message SET sent_status = 1 WHERE id IN (" +
          readButNotSentMessageIDs.current.join(",") +
          ")";
        await db.execAsync(updateQuery);
        return data.posts;
      } catch (error) {
        console.error("Error syncing or fetching messages:", error);
        throw new Error("Error syncing or fetching messages.");
      }
    }
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["messages", activeStudent?.id, readButNotSentMessageIDs],
    queryFn: fetchMessagesFromAPI,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (!lastPage || lastPage.length === 0) {
        return undefined;
      }
      return lastPageParam + 10;
    },
    enabled: !!activeStudent,
    retry: 2,
    refetchInterval(query) {
      return 20000;
    },
    networkMode: "always",
  });

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      if (isOnline) {
        await refetch();
      } else if (activeStudent) {
        setLocalMessages(
          await fetchMessagesFromDB(db, activeStudent.student_number),
        );
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setRefreshing(false);
    }
  }, [activeStudent]);
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <StudentSelector
          students={students}
          activeStudent={activeStudent}
          setActiveStudent={setActiveStudent}
        />
        <Separator orientation="horizontal" />
        <View>
          {isOnline ? (
            status === "pending" ? (
              <ThemedText>Loading...</ThemedText>
            ) : (
              <ScrollView
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
                contentContainerStyle={{ paddingBottom: 80 }}
              >
                {data?.pages?.map((group, i) => (
                  <React.Fragment key={i}>
                    {group.map((message: Message) => (
                      <React.Fragment key={message.id}>
                        <Card message={message} />
                        <Separator orientation="horizontal" />
                      </React.Fragment>
                    ))}
                  </React.Fragment>
                ))}
                <View style={{ padding: 10 }}>
                  <Button
                    title={
                      isFetchingNextPage
                        ? "Loading more..."
                        : hasNextPage
                          ? i18n[language].loadMoreMessages
                          : "Nothing more to load"
                    }
                    onPress={() => fetchNextPage()}
                    disabled={!hasNextPage || isFetchingNextPage}
                  />
                </View>
                <View>
                  {isFetching && !isFetchingNextPage ? (
                    <ThemedText>Fetching...</ThemedText>
                  ) : null}
                </View>
              </ScrollView>
            )
          ) : offlineLoading ? (
            <ThemedText>Loading offline messages...</ThemedText>
          ) : (
            <ScrollView
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              contentContainerStyle={{ paddingBottom: 80 }}
            >
              {localMessages.map((message) => (
                <React.Fragment key={message.id}>
                  <Card message={message} />
                  <Separator orientation="horizontal" />
                </React.Fragment>
              ))}
              <View style={{ padding: 10 }}>
                <Button
                  title="Load More Messages"
                  onPress={fetchNextOfflineMessages}
                />
              </View>
            </ScrollView>
          )}
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

export default HomeScreen;
