import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MENU_ITEMS = [
  { name: "Home", path: "/home" },
  { name: "Products", path: "/product" },
  { name: "Categories", path: "/categories" },
  { name: "Add Microphone", path: "/add" },
  { name: "Settings", path: "/settings" },
];

export default function SettingsScreen() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "Tisana",
    email: "j.hopkins@inventor.io",
    password: "*****************",
    store: "Leicester, UK",
    employeeCode: "94-K-6764-LEI",
    currentRole: "Admin",
  });

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [inputName, setInputName] = useState(userInfo.name);

  const openEditNameModal = () => {
    setInputName(userInfo.name);
    setEditModalVisible(true);
  };

  const handleSaveName = () => {
    setUserInfo({ ...userInfo, name: inputName });
    setEditModalVisible(false);
  };

  const handleLogout = () => {
    setMenuVisible(false);
    router.replace("/");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {/* ==================== HEADER ==================== */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Ionicons name="menu" size={28} color="#6C2BD9" />
        </TouchableOpacity>
        <Text style={styles.logo}>Settings</Text>
        <TouchableOpacity style={styles.profile} onPress={openEditNameModal}>
          <Ionicons name="person" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* ==================== MAIN CONTENT ==================== */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <Text style={styles.sectionTitle}>Personal settings</Text>

        <View style={styles.settingsCard}>
          <View style={styles.infoRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>Name*</Text>
              <Text style={styles.fieldValue}>{userInfo.name}</Text>
            </View>
            <TouchableOpacity onPress={openEditNameModal} style={styles.editIconBtn}>
              <Ionicons name="pencil" size={18} color="#1F2937" />
            </TouchableOpacity>
          </View>

          <View style={styles.infoRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>Company email*</Text>
              <Text style={styles.fieldValue}>{userInfo.email}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>Account password*</Text>
              <Text style={styles.fieldValue}>{userInfo.password}</Text>
            </View>
          </View>

          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>Store</Text>
              <Text style={styles.fieldValue}>{userInfo.store}</Text>
            </View>
          </View>
        </View>
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

        <Link href="/settings" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="settings" size={22} color="#6C2BD9" />
            <Text style={styles.menuActiveText}>Settings</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* ==================== MODAL EDIT NAME ==================== */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalCenterView}>
          <View style={styles.editModalBox}>
            <Text style={styles.editModalTitle}>Edit Profile Name</Text>
            <TextInput
              style={styles.input}
              value={inputName}
              onChangeText={setInputName}
              placeholder="Enter name"
              placeholderTextColor="#9CA3AF"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.btn, styles.btnCancel]} onPress={() => setEditModalVisible(false)}>
                <Text style={styles.btnTextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.btnSave]} onPress={handleSaveName}>
                <Text style={styles.btnTextSave}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ==================== SIDE MENU MODAL ==================== */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <SafeAreaView style={styles.menuOverlay}>
          <View style={styles.overlayHeader}>
            <TouchableOpacity onPress={() => setMenuVisible(false)} style={styles.closeButton}>
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.overlayLogo}>Inventor.io</Text>
            <View style={{ width: 28 }} />
          </View>

          <View style={styles.overlayLinksContainer}>
            {MENU_ITEMS.map((menu, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => {
                  setMenuVisible(false);
                  router.push(menu.path as any);
                }}
              >
                <Text style={styles.overlayMenuText}>{menu.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Log out</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingTop: Platform.OS === "android" ? 30 : 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  logo: { fontSize: 20, fontWeight: "bold", color: "#1F2937" },
  profile: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#6C2BD9",
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2937",
    marginHorizontal: 24,
    marginTop: 10,
    marginBottom: 20,
  },
  settingsCard: {
    backgroundColor: "#EBE3F9",
    marginHorizontal: 24,
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.05)",
  },
  fieldLabel: { fontSize: 14, color: "#1F2937", fontWeight: "600", marginBottom: 4 },
  fieldValue: { fontSize: 15, color: "#4B5563" },
  editIconBtn: { padding: 4 },

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
    height: 70,
  },
  menuItem: { alignItems: "center" },
  menuActiveText: { color: "#6C2BD9", fontWeight: "bold", fontSize: 11, marginTop: 4 },
  menuGray: { color: "#C4B5FD", fontSize: 11, marginTop: 4 },

  modalCenterView: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.4)" },
  editModalBox: { width: "85%", maxWidth: 400, backgroundColor: "#fff", borderRadius: 16, padding: 24 },
  editModalTitle: { fontSize: 18, fontWeight: "bold", color: "#1F2937", marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: "#1F2937",
    marginBottom: 20,
  },
  modalButtons: { flexDirection: "row", justifyContent: "flex-end", gap: 12 },
  btn: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 8 },
  btnCancel: { backgroundColor: "#F3F4F6" },
  btnSave: { backgroundColor: "#6C2BD9" },
  btnTextCancel: { color: "#4B5563", fontWeight: "600" },
  btnTextSave: { color: "#fff", fontWeight: "600" },

  menuOverlay: {
    flex: 1,
    backgroundColor: "#4C1D95",
    paddingHorizontal: 24,
    justifyContent: "space-between",
    paddingBottom: 20,
  },
  overlayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
  },
  closeButton: { padding: 4 },
  overlayLogo: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  overlayLinksContainer: { alignItems: "center", justifyContent: "center", gap: 25 },
  overlayMenuText: { color: "#fff", fontSize: 22, fontWeight: "600" },
  logoutButton: { alignItems: "center", paddingVertical: 10 },
  logoutText: { color: "#fff", fontSize: 16, fontWeight: "500", opacity: 0.9 },
});