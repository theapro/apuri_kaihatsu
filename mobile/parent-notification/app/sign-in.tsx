import React, { useContext, useState } from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSession } from "@/contexts/auth-context";
import { SafeAreaView } from "react-native-safe-area-context";
import Select from "@/components/atomic/select";
import Input from "@/components/atomic/input";
import Button from "@/components/atomic/button";
import SecureInput from "@/components/atomic/secure-input";
import { I18nContext } from "@/contexts/i18n-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn } = useSession();
  const { language, i18n, setLanguage } = useContext(I18nContext);
  const menuOptions = [
    {
      label: "English",
      action: async () => {
        setLanguage("en");
        await AsyncStorage.setItem("language", "en");
      },
    },
    {
      label: "日本語",
      action: () => {
        setLanguage("ja");
        AsyncStorage.setItem("language", "ja");
      },
    },
    {
      label: "O'zbek",
      action: () => {
        setLanguage("uz");
        AsyncStorage.setItem("language", "uz");
      },
    },
  ];
  React.useEffect(() => {
    const loadCredentials = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem("email");

        if (storedEmail) {
          setEmail(storedEmail);
        }
      } catch (error) {
        console.error("Failed to load credentials from AsyncStorage", error);
      }
    };

    loadCredentials();
  }, []);
  const handlePress = () => {
    signIn(email, password);
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>{i18n[language].welcome}</Text>
              <Text style={styles.subtitle}>{i18n[language].login}</Text>
            </View>
            <View>
              <Select
                options={menuOptions}
                selectedValue={
                  language === "en"
                    ? menuOptions[0]
                    : language === "ja"
                      ? menuOptions[1]
                      : menuOptions[2]
                }
              />
            </View>
          </View>
          <Input
            style={{ zIndex: -1 }}
            textContentType="emailAddress"
            keyboardType="email-address"
            autoCapitalize="none"
            maxLength={50}
            selectTextOnFocus={true}
            selectionColor="#84eab3"
            label={i18n[language].email}
            placeholder={i18n[language].enterEmail}
            onChangeText={setEmail}
            value={email}
          />
          <SecureInput
            label={i18n[language].password}
            placeholder={i18n[language].enterPassword}
            onChangeText={setPassword}
            maxLength={50}
            value={password}
            selectTextOnFocus
            keyboardType="numbers-and-punctuation"
            textContentType="password"
            autoCapitalize="none"
          />
          <Button onPress={handlePress} title={i18n[language].loginToAccount} />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: "white",
    alignContent: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 10,
    marginBottom: 50,
  },
  title: {
    color: "black",
    fontWeight: "bold",
    fontSize: 20,
  },
  subtitle: {
    color: "gray",
    fontSize: 16,
  },
  inputContainer: {
    paddingTop: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 2,
    paddingTop: 10,
  },
  resetPassword: {
    fontWeight: "bold",
    color: "#059669",
  },
});
