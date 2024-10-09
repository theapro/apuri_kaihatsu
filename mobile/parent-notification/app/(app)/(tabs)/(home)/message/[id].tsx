import React, { useContext, useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useSQLiteContext } from "expo-sqlite";
import { useSession } from "@/contexts/auth-context";
import formatformatMessageDate from "@/utils/format";
import { I18nContext } from "@/contexts/i18n-context";
import { DatabaseMessage } from "@/constants/types";
import { useNetwork } from "@/contexts/network-context";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  titleRow: {
    flexDirection: "row",
    marginTop: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  iconContainer: {
    padding: 5,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    gap: 10,
  },
  dateText: {
    fontSize: 12,
    fontWeight: "300",
  },
  descriptionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    paddingBottom: 50,
  },

  importanceBadge: {
    padding: 5,
    borderRadius: 5,
    backgroundColor: "red",
    color: "white",
    fontSize: 12,
  },
  groupStyle: {
    backgroundColor: "#059669",
    color: "white",
    fontSize: 12,
    padding: 5,
    borderRadius: 5,
  },
});

export default function DetailsScreen() {
  const { id } = useLocalSearchParams();
  const { language, i18n } = useContext(I18nContext);
  const { session } = useSession();
  const { isOnline } = useNetwork();
  const db = useSQLiteContext();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";
  const [message, setMessage] = useState<DatabaseMessage | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const handleMessage = async () => {
      const result: DatabaseMessage | null = await db.getFirstSync(
        "SELECT * FROM message WHERE id = ?",
        [Number(id)],
      );
      if (!result) {
        console.error("Message not found");
        return;
      }
      setMessage(result as DatabaseMessage);
      await db.runAsync(
        "UPDATE message SET read_status = 1, read_time = datetime('now') WHERE id = ?",
        [Number(id)],
      );

      if (result.sent_status === 0 && isOnline) {
        const response = await fetch(`${apiUrl}/view`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session}`,
          },
          body: JSON.stringify({
            post_id: result.id,
            student_id: result.student_id,
          }),
        });
        if (response.ok) {
          await db.runAsync("UPDATE message SET sent_status = 1 WHERE id = ?", [
            Number(id),
          ]);
        } else {
          console.error("Failed to send message with ID:", result.id);
        }
      }
    };

    handleMessage().then(() => setLoading(false));
  }, [id]);
  if (loading && !message) {
    return <ThemedText>Loading...</ThemedText>;
  }
  const getImportanceBadgeStyle = (priority: string) => {
    switch (priority) {
      case "high":
        return { ...styles.importanceBadge, backgroundColor: "red" };
      case "medium":
        return { ...styles.importanceBadge, backgroundColor: "orange" };
      case "low":
        return { ...styles.importanceBadge, backgroundColor: "green" };
      default:
        return styles.importanceBadge;
    }
  };
  const getImportanceLabel = (priority: string) => {
    const mapping: { [key: string]: string } = {
      high: i18n[language].critical,
      medium: i18n[language].important,
      low: i18n[language].ordinary,
    };
    return mapping[priority] || "unknown";
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.titleRow}>
        <ThemedText style={styles.title}>{message?.title}</ThemedText>
      </View>
      <View style={styles.dateRow}>
        <ThemedText style={styles.dateText}>
          {message &&
            formatformatMessageDate(new Date(message.sent_time), language)}
        </ThemedText>
        <ThemedText
          style={message && getImportanceBadgeStyle(message.priority)}
        >
          {message && getImportanceLabel(message.priority)}
        </ThemedText>
        {message && message.group_name && (
          <ThemedText style={styles.groupStyle}>
            Group {message && message.group_name}
          </ThemedText>
        )}
      </View>
      <View style={styles.descriptionRow}>
        <ThemedText>{message?.content}</ThemedText>
      </View>
    </ScrollView>
  );
}
