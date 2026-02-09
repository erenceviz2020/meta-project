
import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  FlatList,
  Image,
  Platform,
} from "react-native";

const CATEGORIES = ["Starters", "Mains", "Desserts", "Drinks"];

const MENU_ITEMS = [
  {
    id: "1",
    title: "Greek Salad",
    description: "Crispy lettuce, peppers, olives and feta.",
    price: "$12.99",
    category: "Starters",
    image: require("../assets/greek_salad.png"),
  },
  {
    id: "2",
    title: "Bruschetta",
    description: "Grilled bread with garlic and tomato.",
    price: "$7.99",
    category: "Starters",
    image: require("../assets/bruschetta.png"),
  },
  {
    id: "3",
    title: "Grilled Fish",
    description: "Red onion, capers, fresh herbs.",
    price: "$20.00",
    category: "Mains",
    image: require("../assets/grilled_fish.png"),
  },
  {
    id: "4",
    title: "Pasta",
    description: "Tomato sauce, basil, parmesan.",
    price: "$18.99",
    category: "Mains",
    image: require("../assets/pasta.png"),
  },
  {
    id: "5",
    title: "Lemon Dessert",
    description: "Traditional homemade lemon ricotta cake.",
    price: "$6.99",
    category: "Desserts",
    image: require("../assets/lemon_dessert.png"),
  },
  {
    id: "6",
    title: "Fresh Lemonade",
    description: "Cold, refreshing, made daily.",
    price: "$4.50",
    category: "Drinks",
    image: require("../assets/limonata.png"), 
  },
];


export default function HomeScreen({ navigation }) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Starters");

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    return MENU_ITEMS.filter((item) => {
      const matchesCategory = item.category === selectedCategory;
      const matchesSearch =
        q.length === 0 ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [search, selectedCategory]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardText}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemDesc} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.itemPrice}>{item.price}</Text>
      </View>

      <Image source={item.image} style={styles.itemImage} resizeMode="cover" />
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <Image
           source={require("../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.logoText}>Little Lemon</Text>
        </View>

        <Pressable
          onPress={() => navigation.navigate("Profile")}
          style={({ pressed }) => [styles.profileBtn, pressed && styles.pressed]}
        >
          <Text style={styles.profileBtnText}>Profile</Text>
        </Pressable>
      </View>

      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Little Lemon</Text>
        <Text style={styles.heroCity}>Chicago</Text>

        <Text style={styles.heroDesc}>
          We are a family owned Mediterranean restaurant, focused on traditional
          recipes served with a modern twist.
        </Text>

        <View style={styles.searchRow}>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search"
            style={styles.searchInput}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />
        </View>
      </View>

      {/* Menu breakdown */}
      <View style={styles.breakdown}>
        <Text style={styles.breakdownTitle}>ORDER FOR DELIVERY!</Text>

        <View style={styles.categoriesRow}>
          {CATEGORIES.map((cat) => {
            const active = cat === selectedCategory;
            return (
              <Pressable
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={({ pressed }) => [
                  styles.catBtn,
                  active && styles.catBtnActive,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={[styles.catText, active && styles.catTextActive]}>
                  {cat}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Food menu list */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No items found.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#ffffff" },

  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  logo: { width: 30, height: 30 },
  logoText: { fontSize: 16, fontWeight: "800" },
  profileBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#fff",
  },
  profileBtnText: { fontWeight: "800" },
  pressed: { opacity: 0.85 },

  hero: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    backgroundColor: "#495E57",
  },
  heroTitle: { fontSize: 26, fontWeight: "900", color: "#F4CE14" },
  heroCity: { fontSize: 18, fontWeight: "800", color: "#ffffff", marginTop: 2 },
  heroDesc: {
    color: "#ffffff",
    marginTop: 8,
    lineHeight: 20,
    fontSize: 14,
  },
  searchRow: { marginTop: 12 },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 12 : 10,
    fontSize: 16,
  },

  breakdown: {
    marginTop: 12,
    marginHorizontal: 16,
    paddingVertical: 12,
  },
  breakdownTitle: {
    fontWeight: "900",
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  categoriesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  catBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
  },
  catBtnActive: {
    backgroundColor: "#F4CE14",
  },
  catText: { fontWeight: "800", color: "#111827" },
  catTextActive: { color: "#111827" },

  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 4,
    gap: 12,
  },
  card: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    backgroundColor: "#fff",
  },
  cardText: { flex: 1 },
  itemTitle: { fontSize: 16, fontWeight: "900", marginBottom: 4 },
  itemDesc: { color: "#374151", lineHeight: 18 },
  itemPrice: { marginTop: 8, fontWeight: "900" },
  itemImage: { width: 72, height: 72, borderRadius: 12 },

  emptyText: {
    paddingHorizontal: 16,
    paddingTop: 16,
    color: "#6B7280",
    fontWeight: "700",
  },
});
