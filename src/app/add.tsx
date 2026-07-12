// src/app/add.tsx
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function AddProductScreen() {
  // 🔥 เพิ่มสถานะสเตตัสสำหรับควบคุมการเปิด-ปิด เมนูสามขีดแบบหน้า Home
  const [menuVisible, setMenuVisible] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    itemCode: "",
    stockSize: "",
    store: "",
  });

  const menuItems = ["Home", "Products", "Categories", "Stores", "Finances", "Settings"];

  const handleSave = () => {
    alert("Product saved successfully!");
    console.log("Saved Data:", form);
  };

  return (
    <View style={styles.container}>
      {/* ==================== HEADER ==================== */}
      <View style={styles.header}>
        {/* 🔥 แก้ไข: เพิ่ม onPress ให้เปิดเมนูได้เมื่อกดปุ่มสามขีด */}
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Ionicons name="menu" size={28} color="#6C2BD9" />
        </TouchableOpacity>
        
        <Text style={styles.logo}>Add product</Text>
        <Link href="/settings" asChild>
          <TouchableOpacity style={styles.profile}>
            <Ionicons name="person" size={18} color="#fff" />
          </TouchableOpacity>
        </Link>
      </View>

      {/* ==================== FORM CONTENT ==================== */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name*</Text>
          <TextInput
            style={styles.input}
            value={form.name}
            onChangeText={(text) => setForm({ ...form, name: text })}
            placeholder="Enter product name"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={form.description}
            onChangeText={(text) => setForm({ ...form, description: text })}
            multiline={true}
            numberOfLines={4}
            placeholder="Enter product description"
            placeholderTextColor="#9CA3AF"
            textAlignVertical="top"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category*</Text>
          <TextInput
            style={styles.input}
            value={form.category}
            onChangeText={(text) => setForm({ ...form, category: text })}
            placeholder="Enter category"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Price*</Text>
          <TextInput
            style={styles.input}
            value={form.price}
            onChangeText={(text) => setForm({ ...form, price: text })}
            keyboardType="numeric"
            placeholder="฿0.00"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Item code*</Text>
          <TextInput
            style={styles.input}
            value={form.itemCode}
            onChangeText={(text) => setForm({ ...form, itemCode: text })}
            placeholder="Enter item code"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Stock size*</Text>
          <TextInput
            style={styles.input}
            value={form.stockSize}
            onChangeText={(text) => setForm({ ...form, stockSize: text })}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Stores availability*</Text>
          <View style={styles.dropdownContainer}>
            <TextInput
              style={[styles.input, { paddingRight: 40, marginBottom: 0 }]}
              value={form.store}
              onChangeText={(text) => setForm({ ...form, store: text })}
              placeholder="Select store"
              placeholderTextColor="#9CA3AF"
            />
            <Ionicons name="chevron-down" size={18} color="#6C2BD9" style={styles.dropdownIcon} />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Product photos*</Text>
          <View style={styles.photoUploadBox}>
            <Ionicons name="image-outline" size={32} color="#9CA3AF" />
            <Text style={{ color: "#9CA3AF", marginTop: 4, fontSize: 13 }}>Upload photos</Text>
          </View>
        </View>

        {/* ปุ่มบันทึกขนาดใหญ่สีม่วงท้ายฟอร์ม */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save product</Text>
        </TouchableOpacity>
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
            <Ionicons name="add-circle" size={22} color="#6C2BD9" />
            <Text style={styles.menuText}>Add</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/product" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="cube-outline" size={22} color="#C4B5FD" />
            <Text style={styles.menuGray}>Product</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/categories" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="grid-outline" size={22} color="#C4B5FD" />
            <Text style={styles.menuGray}>Categories</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* ==================== 🔥 เพิ่ม FULLSCREEN PURPLE MENU LAYER เหมือนหน้า Home ==================== */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.menuOverlay}>
          <View style={styles.overlayHeader}>
            <TouchableOpacity onPress={() => setMenuVisible(false)} style={styles.closeButton}>
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.overlayLogo}>Inventor.io</Text>
            <View style={{ width: 28 }} />
          </View>

          <View style={styles.overlayLinksContainer}>
            {menuItems.map((menu, idx) => (
              <TouchableOpacity key={idx} onPress={() => setMenuVisible(false)}>
                <Text style={styles.overlayMenuText}>{menu}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={() => setMenuVisible(false)}>
            <Text style={styles.logoutText}>Log out</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F9FAFB", 
    paddingTop: 50 
  },
  header: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    paddingHorizontal: 24, 
    marginBottom: 10, 
    height: 50 
  },
  logo: { 
    fontSize: 20, 
    fontWeight: "bold", 
    color: "#1F2937" 
  },
  profile: { 
    width: 34, 
    height: 34, 
    borderRadius: 17, 
    backgroundColor: "#6C2BD9", 
    justifyContent: "center", 
    alignItems: "center" 
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 120, 
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F3F4F6", 
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: "#1F2937",
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  dropdownContainer: {
    position: "relative",
    justifyContent: "center",
  },
  dropdownIcon: {
    position: "absolute",
    right: 16,
  },
  photoUploadBox: {
    height: 120,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#4C1D95", 
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#4C1D95",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  bottom: { 
    position: "absolute", 
    bottom: 0, 
    left: 0, 
    right: 0, 
    backgroundColor: "#fff", 
    flexDirection: "row", 
    justifyContent: "space-around", 
    paddingVertical: 12, 
    borderTopWidth: 1, 
    borderColor: "#F3F4F6", 
    height: 70 
  },
  menuItem: { 
    alignItems: "center" 
  },
  menuText: { 
    color: "#6C2BD9", 
    fontWeight: "bold", 
    fontSize: 11, 
    marginTop: 4 
  },
  menuGray: { 
    color: "#C4B5FD", 
    fontSize: 11, 
    marginTop: 4 
  },
  // โครงสร้างสไตล์ของเมนู Modal เต็มจอที่เพิ่มเข้ามา
  menuOverlay: {
    flex: 1,
    backgroundColor: "#4C1D95",
    paddingTop: 50,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    paddingBottom: 40,
  },
  overlayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
  },
  closeButton: {
    padding: 4,
  },
  overlayLogo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  overlayLinksContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: 25,
  },
  overlayMenuText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "600",
  },
  logoutButton: {
    alignItems: "center",
    paddingVertical: 10,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    opacity: 0.9,
  },
});