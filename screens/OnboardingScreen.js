
import React, { useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  firstName: "ll_firstName",
  email: "ll_email",
  isOnboarded: "ll_isOnboarded",
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function OnboardingScreen({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");

  
  useEffect(() => {
    (async () => {
      try {
        const isOnboarded = await AsyncStorage.getItem(STORAGE_KEYS.isOnboarded);
        if (isOnboarded === "true") {
          navigation.replace("Home");
        }
      } catch (e) {
        
      }
    })();
  }, [navigation]);

  const isValid = useMemo(() => {
    const nameOk = firstName.trim().length >= 2;
    const emailOk = emailRegex.test(email.trim().toLowerCase());
    return nameOk && emailOk;
  }, [firstName, email]);

  const handleNext = async () => {
    if (!isValid) return;

    try {
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.firstName, firstName.trim()],
        [STORAGE_KEYS.email, email.trim().toLowerCase()],
        [STORAGE_KEYS.isOnboarded, "true"],
      ]);

      navigation.replace("Home");
    } catch (e) {
      Alert.alert("Hata", "Bilgiler kaydedilemedi. Tekrar dene.");
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header / Branding */}
          <View style={styles.brandRow}>
            <Image
              source={require("../assets/logo.png")}

              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.brandText}>Little Lemon</Text>
          </View>

          {/* Hero */}
          <View style={styles.hero}>
            <Text style={styles.title}>Welcome 👋</Text>
            <Text style={styles.subtitle}>
              Başlamak için adını ve e-postanı gir.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.label}>Name *</Text>
            <TextInput
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Örn: Tilly"
              style={styles.input}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="next"
            />

            <Text style={styles.label}>Email *</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="ör: tillydoe@example.com"
              style={styles.input}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="emailAddress"
              returnKeyType="done"
            />

            <Pressable
              onPress={handleNext}
              disabled={!isValid}
              style={({ pressed }) => [
                styles.button,
                !isValid && styles.buttonDisabled,
                pressed && isValid && styles.buttonPressed,
              ]}
            >
              <Text style={styles.buttonText}>İleri</Text>
            </Pressable>

            <Text style={styles.hint}>
              * İleri butonu sadece geçerli bilgiler girilince aktif olur.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, backgroundColor: "#ffffff" },
  container: {
    padding: 16,
    paddingBottom: 28,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 18,
  },
  logo: {
    width: 34,
    height: 34,
  },
  brandText: {
    fontSize: 18,
    fontWeight: "700",
  },
  hero: {
    backgroundColor: "#495E57",
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#F4CE14",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#ffffff",
    lineHeight: 20,
  },
  form: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
  },
  label: {
    marginTop: 10,
    marginBottom: 6,
    fontWeight: "700",
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 12 : 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  button: {
    marginTop: 16,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#F4CE14",
  },
  buttonDisabled: {
    backgroundColor: "#E5E7EB",
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
  },
  hint: {
    marginTop: 10,
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 16,
  },
});
