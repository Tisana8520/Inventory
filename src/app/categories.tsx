// src/app/categories.tsx
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CategoriesScreen() {
  // อัปเดตข้อมูลหมวดหมู่เป็นชื่อรุ่นไมโครโฟนและจำนวนชิ้นตามภาพ UI ใหม่ครับ
  const [categories] = useState([
    { id: 1, name: "HyperX SoloCast", items: "12 items", icon: "mic-outline" },
    { id: 2, name: "Fantech Leviosa MCX01", items: "8 items", icon: "mic-outline" },
    { id: 3, name: "Shure SM7B Cardioid", items: "5 items", icon: "mic-outline" },
  ]);

  return (
    <View style={styles.container}>
      {/* ==================== HEADER ==================== */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="menu" size={28} color="#6C2BD9" />
        </TouchableOpacity>
        <Text style={styles.logo}>Categories</Text>
        <Link href="/settings" asChild>
          <TouchableOpacity style={styles.profile}>
            <Ionicons name="person" size={18} color="#fff" />
          </TouchableOpacity>
        </Link>
      </View>

      {/* ==================== CATEGORIES LIST ==================== */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {categories.map((category) => (
          <View key={category.id} style={styles.categoryCard}>
            {/* กล่องไอคอนสีม่วงอ่อนซ้ายมือ */}
            <View style={styles.iconBox}>
              <Ionicons name={category.icon as any} size={26} color="#6C2BD9" />
            </View>
            
            {/* ข้อความรายละเอียดตรงกลาง */}
            <View style={styles.textContainer}>
              <Text style={styles.categoryName} numberOfLines={1}>
                {category.name}
              </Text>
              <Text style={styles.itemCount}>{category.items}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* ==================== BOTTOM NAV ==================== */}
      <View style={styles.bottom}>
        <Link href="/home" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="home-outline" size={22} color="#C4B5FD" />
            <Text style={styles.menuGray}>Home</Text>
          </TouchableOpacity>
        </Link>
        
        <Link href="/add" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="add-circle-outline" size={22} color="#C4B5FD" />
            <Text style={styles.menuGray}>Add</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/product" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="cube-outline" size={22} color="#C4B5FD" />
            <Text style={styles.menuGray}>Products</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/categories" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="grid" size={22} color="#6C2BD9" />
            <Text style={styles.menuText}>Categories</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB", paddingTop: 50 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, marginBottom: 25, height: 50 },
  logo: { fontSize: 20, fontWeight: "bold", color: "#1F2937" },
  profile: { width: 34, height: 34, borderRadius: 17, backgroundColor: "#6C2BD9", justifyContent: "center", alignItems: "center" },
  
  // Category Card
  categoryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6", 
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  iconBox: {
    width: 60,
    height: 60,
    backgroundColor: "#EBE3F9", 
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    marginLeft: 20,
    flex: 1, // เพิ่ม flex ให้ชื่อรุ่นยาวๆ แสดงผลได้สวยงาม ไม่ล้นการ์ด
    justifyContent: "center",
  },
  categoryName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  itemCount: {
    fontSize: 14,
    color: "#6B7280",
  },

  // Bottom Navigation
  bottom: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#fff", flexDirection: "row", justifyContent: "space-around", paddingVertical: 12, borderTopWidth: 1, borderColor: "#F3F4F6", height: 70 },
  menuItem: { alignItems: "center" },
  menuText: { color: "#6C2BD9", fontWeight: "bold", fontSize: 11, marginTop: 4 },
  menuGray: { color: "#C4B5FD", fontSize: 11, marginTop: 4 },
});