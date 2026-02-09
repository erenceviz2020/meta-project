
import React, { useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  firstName: "ll_firstName",
  email: "ll_email",
  phone: "ll_phone",
  isOnboarded: "ll_isOnboarded",
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ProfileScreen({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [orderStatuses, setOrderStatuses] = useState(true);
  const [passwordChanges, setPasswordChanges] = useState(true);
  const [specialOffers, setSpecialOffers] = useState(true);
  const [newsletter, setNewsletter] = useState(true);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const values = await AsyncStorage.multiGet([
          STORAGE_KEYS.firstName,
          STORAGE_KEYS.email,
          STORAGE_KEYS.phone,
          STORAGE_KEYS.isOnboarded,
        ]);

        const map = Object.fromEntries(values);

        
        if (map[STORAGE_KEYS.isOnboarded] !== "true") {
          navigation.replace("Onboarding");
          return;
        }

        setFirstName(map[STORAGE_KEYS.firstName] ?? "");
        setEmail(map[STORAGE_KEYS.email] ?? "");
        setPhone(map[STORAGE_KEYS.phone] ?? "");
      } catch (e) {
        
      } finally {
        setLoading(false);
      }
    })();
  }, [navigation]);

  const isValid = useMemo(() => {
    const nameOk = firstName.trim().length >= 2;
    const emailOk = emailRegex.test(email.trim().toLowerCase());
    
    const phoneDigits = phone.replace(/\D/g, "");
    const phoneOk = phone.trim().length === 0 || phoneDigits.length >= 7;
    return nameOk && emailOk && phoneOk;
  }, [firstName, email, phone]);

  const handleSave = async () => {
    if (!isValid) {
      Alert.alert("Uyarı", "Lütfen geçerli bilgileri gir.");
      return;
    }

    try {
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.firstName, firstName.trim()],
        [STORAGE_KEYS.email, email.trim().toLowerCase()],
        [STORAGE_KEYS.phone, phone.trim()],
        [STORAGE_KEYS.isOnboarded, "true"],
      ]);

      Alert.alert("Başarılı", "Değişiklikler kaydedildi.");
    } catch (e) {
      Alert.alert("Hata", "Kaydedilemedi. Tekrar dene.");
    }
  };

  const handleDiscard = async () => {
    
    try {
      const values = await AsyncStorage.multiGet([
        STORAGE_KEYS.firstName,
        STORAGE_KEYS.email,
        STORAGE_KEYS.phone,
      ]);
      const map = Object.fromEntries(values);
      setFirstName(map[STORAGE_KEYS.firstName] ?? "");
      setEmail(map[STORAGE_KEYS.email] ?? "");
      setPhone(map[STORAGE_KEYS.phone] ?? "");
    } catch (e) {}
  };

  const handleLogout = async () => {
    Alert.alert("Log out", "Çıkış yapmak istiyor musun?", [
      { text: "İptal", style: "cancel" },
      {
        text: "Çıkış",
        style: "destructive",
        onPress: async () => {
          try {
            
            await AsyncStorage.multiRemove([
              STORAGE_KEYS.firstName,
              STORAGE_KEYS.email,
              STORAGE_KEYS.phone,
              STORAGE_KEYS.isOnboarded,
            ]);
            navigation.replace("Onboarding");
          } catch (e) {
            Alert.alert("Hata", "Çıkış yapılamadı.");
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingWrap}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
          <Text style={styles.title}>Personal information</Text>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Details</Text>

            <Text style={styles.label}>First name</Text>
            <TextInput
              value={firstName}
              onChangeText={setFirstName}
              style={styles.input}
              autoCapitalize="words"
              autoCorrect={false}
              placeholder="First name"
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              placeholder="Email"
            />

            <Text style={styles.label}>Phone number (optional)</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              style={styles.input}
              keyboardType={Platform.OS === "ios" ? "number-pad" : "numeric"}
              placeholder="Phone number"
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Email notifications</Text>

            <View style={styles.row}>
              <Text style={styles.rowText}>Order statuses</Text>
              <Pressable
                onPress={() => setOrderStatuses((v) => !v)}
                style={[
                  styles.toggle,
                  orderStatuses ? styles.toggleOn : styles.toggleOff,
                ]}
              >
                <Text style={styles.toggleText}>
                  {orderStatuses ? "On" : "Off"}
                </Text>
              </Pressable>
            </View>

            <View style={styles.row}>
              <Text style={styles.rowText}>Password changes</Text>
              <Pressable
                onPress={() => setPasswordChanges((v) => !v)}
                style={[
                  styles.toggle,
                  passwordChanges ? styles.toggleOn : styles.toggleOff,
                ]}
              >
                <Text style={styles.toggleText}>
                  {passwordChanges ? "On" : "Off"}
                </Text>
              </Pressable>
            </View>

            <View style={styles.row}>
              <Text style={styles.rowText}>Special offers</Text>
              <Pressable
                onPress={() => setSpecialOffers((v) => !v)}
                style={[
                  styles.toggle,
                  specialOffers ? styles.toggleOn : styles.toggleOff,
                ]}
              >
                <Text style={styles.toggleText}>
                  {specialOffers ? "On" : "Off"}
                </Text>
              </Pressable>
            </View>

            <View style={styles.row}>
              <Text style={styles.rowText}>Newsletter</Text>
              <Pressable
                onPress={() => setNewsletter((v) => !v)}
                style={[
                  styles.toggle,
                  newsletter ? styles.toggleOn : styles.toggleOff,
                ]}
              >
                <Text style={styles.toggleText}>
                  {newsletter ? "On" : "Off"}
                </Text>
              </Pressable>
            </View>
          </View>

          <Pressable onPress={handleLogout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Log out</Text>
          </Pressable>

          <View style={styles.bottomRow}>
            <Pressable onPress={handleDiscard} style={styles.secondaryBtn}>
              <Text style={styles.secondaryText}>Discard changes</Text>
            </Pressable>

            <Pressable
              onPress={handleSave}
              disabled={!isValid}
              style={[
                styles.primaryBtn,
                !isValid && styles.primaryBtnDisabled,
              ]}
            >
              <Text style={styles.primaryText}>Save changes</Text>
            </Pressable>
          </View>

          {!isValid && (
            <Text style={styles.validationHint}>
              Name en az 2 karakter olmalı, email geçerli olmalı. Telefon
              girildiyse en az 7 rakam içermeli.
            </Text>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, backgroundColor: "#ffffff" },
  loadingWrap: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { fontWeight: "800" },

  container: { padding: 16, paddingBottom: 28 },
  title: { fontSize: 20, fontWeight: "900", marginBottom: 12 },

  card: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  sectionTitle: { fontSize: 16, fontWeight: "900", marginBottom: 10 },

  label: { marginTop: 10, marginBottom: 6, fontWeight: "800" },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 12 : 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  rowText: { fontWeight: "800" },
  toggle: {
    minWidth: 70,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 999,
  },
  toggleOn: { backgroundColor: "#F4CE14" },
  toggleOff: { backgroundColor: "#E5E7EB" },
  toggleText: { fontWeight: "900" },

  logoutBtn: {
    marginTop: 6,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#FDE68A",
  },
  logoutText: { fontWeight: "900" },

  bottomRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  secondaryBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  secondaryText: { fontWeight: "900" },

  primaryBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#495E57",
  },
  primaryBtnDisabled: { backgroundColor: "#9CA3AF" },
  primaryText: { fontWeight: "900", color: "#fff" },

  validationHint: {
    marginTop: 10,
    color: "#6B7280",
    fontSize: 12,
    lineHeight: 16,
  },
});
