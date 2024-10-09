import { useContext, useEffect, useState } from "react";
import {
  Keyboard,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ThemedText } from "@/components/ThemedText";
import { I18nContext, Language } from "@/contexts/i18n-context";
import { useStudents } from "@/contexts/student-context";
import { Student } from "@/constants/types";
import { reasonMapping } from "@/translations/translation";
import { useSession } from "@/contexts/auth-context";
import Toast from "react-native-root-toast";

export default function TabTwoScreen() {
  const { language, i18n } = useContext(I18nContext);
  const { students } = useStudents();
  const { session } = useSession();
  const theme = useColorScheme() ?? "light";
  const [activeStudent, setActiveStudent] = useState<Student | null>();
  const [activeReason, setActiveReason] = useState("absense");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [text, setText] = useState("");
  const translatedButtons = [
    { key: "absense", label: i18n[language].absense },
    { key: "lateness", label: i18n[language].lateness },
    { key: "leaving", label: i18n[language].leaving },
    { key: "other", label: i18n[language].other },
  ];

  const handleSubmit = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) {
      Toast.show(i18n[language].chooseCorrectDate, {
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
      return;
    }

    const formData = {
      reason: reasonMapping.en[activeReason],
      additional_message: text,
      date: date.toISOString().split("T")[0],
      student_id: activeStudent?.id,
    };

    fetch(
      "https://e45np4n3jb.execute-api.ap-northeast-1.amazonaws.com/api/create/forms",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${session}`,
        },
        body: JSON.stringify(formData),
      },
    )
      .then((response) => response.json())
      .then((data) => {
        Toast.show(`${data.message}`, {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          containerStyle: {
            backgroundColor: "#059669",
            borderRadius: 5,
          },
        });
        resetForm();
      })
      .catch((error) => {
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
      });
  };

  const resetForm = () => {
    setActiveReason("absense");
    setDate(new Date());
    setText("");
    if (students) {
      setActiveStudent(students[0]);
    }
  };

  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || date;
    setShowPicker(false);
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShowPicker(true);
  };

  useEffect(() => {
    if (students) {
      setActiveStudent(students[0]);
    }
  }, [students]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView>
        <SafeAreaView style={styles.container}>
          <ThemedText style={styles.textCenter}>
            {i18n[language].form_message}
          </ThemedText>
          <View>
            <ThemedText style={styles.textSmall}>
              {i18n[language].choose_student}
            </ThemedText>

            <View style={styles.reason}>
              {students &&
                students.map((student) => (
                  <Pressable
                    key={student.id}
                    style={[
                      styles.button,
                      activeStudent === student
                        ? styles.activeButton
                        : undefined,
                    ]}
                    onPress={() => setActiveStudent(student)}
                  >
                    <ThemedText
                      style={[
                        styles.buttonText,
                        activeStudent === student
                          ? styles.activeButtonText
                          : undefined,
                      ]}
                    >
                      {student.given_name}
                    </ThemedText>
                  </Pressable>
                ))}
            </View>
          </View>
          <View>
            <ThemedText style={styles.textSmall}>
              {i18n[language].reason}
            </ThemedText>

            <View style={styles.reason}>
              {translatedButtons.map(({ key, label }) => (
                <Pressable
                  key={key}
                  style={[
                    styles.button,
                    activeReason === key ? styles.activeButton : undefined,
                  ]}
                  onPress={() => setActiveReason(key)}
                >
                  <ThemedText
                    style={[
                      styles.buttonText,
                      activeReason === key
                        ? styles.activeButtonText
                        : undefined,
                    ]}
                  >
                    {label}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </View>
          <View>
            <ThemedText style={styles.textSmall}>
              {i18n[language].chooseDate}
            </ThemedText>
            <Pressable style={styles.datePicker} onPress={showDatepicker}>
              <Ionicons name="calendar-outline" size={24} color="grey" />
              <ThemedText style={styles.textCenter}>
                {date.toLocaleDateString()}
              </ThemedText>
            </Pressable>
            {showPicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={"date"}
                is24Hour={true}
                display="default"
                onChange={onChange}
              />
            )}
          </View>
          <View style={styles.textInputContainer}>
            <ThemedText style={styles.textSmall}>
              {i18n[language].additionalMessage}
            </ThemedText>
            <TextInput
              style={[
                styles.textInput,
                { color: theme == "light" ? "black" : "white" },
              ]}
              underlineColorAndroid="transparent"
              placeholder={i18n[language].message_placeholder}
              placeholderTextColor="grey"
              numberOfLines={5}
              multiline={true}
              onChangeText={setText}
              value={text}
            />
          </View>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <ThemedText style={styles.submitButtonText}>
              {i18n[language].submitForm}
            </ThemedText>
          </TouchableOpacity>
        </SafeAreaView>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    display: "flex",
    rowGap: 16,
  },
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  textCenter: {
    fontSize: 16,
    textAlign: "center",
  },
  textSmall: {
    fontSize: 14,
    marginBottom: 4,
  },
  flexRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 4,
  },
  datePicker: {
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    flexDirection: "row",
    gap: 20,
  },
  textInputContainer: {
    height: 144,
  },
  textInput: {
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#059669",
    padding: 16,
    borderRadius: 4,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  reason: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 4,
  },
  button: {
    padding: 8,
    flex: 1,
    borderRadius: 4,
    justifyContent: "center",
  },
  activeButton: {
    padding: 8,
    flex: 1,
    borderRadius: 2,
    backgroundColor: "#059669",
    justifyContent: "center",
  },
  buttonText: {
    textAlign: "center",
  },
  activeButtonText: {
    textAlign: "center",
    color: "#FFF",
  },
});
