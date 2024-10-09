import React, { useContext, useState } from "react";
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useRouter } from "expo-router";
import { I18nContext } from "@/contexts/i18n-context";
import formatMessageDate from "@/utils/format";
import { Message } from "@/constants/types";
import cn from "@/utils/utils";
import { Ionicons } from "@expo/vector-icons";

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    marginRight: 15,
  },
  iconContainer: {
    marginRight: 8,
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
  },
  readMoreButton: {
    marginTop: 5,
  },
  readMoreText: {
    color: "#059669",
    fontWeight: "600",
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

const Card = ({ message }: { message: Message }) => {
  const router = useRouter();
  const { language, i18n } = useContext(I18nContext);
  const [viewed, setViewed] = useState(message.viewed_at != null);
  const handlePress = () => {
    router.push(`message/${message.id}`);
    setViewed(true);
  };
  const getImportanceLabel = (priority: string) => {
    const mapping: { [key: string]: string } = {
      high: i18n[language].critical,
      medium: i18n[language].important,
      low: i18n[language].ordinary,
    };
    return mapping[priority] || "unknown";
  };
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
  return (
    <Pressable onPress={handlePress}>
      <View style={[styles.container, { opacity: viewed ? 0.5 : 1 }]}>
        <View style={styles.titleRow}>
          {viewed ? null : (
            <View style={styles.iconContainer}>
              <Ionicons color="green" name="ellipse" size={12} />
            </View>
          )}
          <ThemedText
            type="default"
            numberOfLines={1}
            style={cn(viewed ? null : { marginRight: 20 })}
          >
            {message.title}
          </ThemedText>
        </View>
        <View style={styles.dateRow}>
          <ThemedText style={styles.dateText}>
            {formatMessageDate(new Date(message.sent_time), language)}
          </ThemedText>
          <ThemedText style={getImportanceBadgeStyle(message.priority)}>
            {getImportanceLabel(message.priority)}
          </ThemedText>
          {message.group_name && (
            <ThemedText style={styles.groupStyle}>
              {message.group_name}
            </ThemedText>
          )}
        </View>
        <View style={styles.descriptionRow}>
          <ThemedText numberOfLines={5}>{message.content}</ThemedText>
        </View>
        <TouchableOpacity style={styles.readMoreButton}>
          <ThemedText style={styles.readMoreText} onPress={handlePress}>
            {i18n[language].continueReading}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </Pressable>
  );
};

export default Card;
