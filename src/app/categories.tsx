import { Ionicons } from "@expo/vector-icons";
import { Link, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Category {
  id: string | number;
  name: string;
  items: string;
  icon: string;
}

export default function CategoriesScreen() {
  // ตั้งค่าหมวดหมู่เริ่มต้นเป็นยี่ห้อไมโครโฟนต่าง ๆ
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: "HyperX Mics", items: "12 items", icon: "mic-outline" },
    { id: 2, name: "Shure Mics", items: "8 items", icon: "mic-outline" },
    { id: 3, name: "RODE Mics", items: "5 items", icon: "mic-outline" },
    { id: 4, name: "Fifine Mics", items: "4 items", icon: "mic-outline" },
  ]);

  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [saving, setSaving] = useState(false);

  const menuItems = ["Home", "Products", "Categories", "Stores", "Finances", "Settings"];
  const BASE_URL = "http://119.59.102.161:3061";

  // ส่งคืนไอคอนไมโครโฟนเสมอ
  const getCategoryIcon = (): string => {
    return "mic-outline";
  };

  // ฟังก์ชัน Alert สำหรับ Web และ Native
  const showAlert = (title: string, message: string) => {
    if (Platform.OS === "web") {
      alert(`${title}\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  // ==================== FETCH CATEGORIES FROM SERVER ====================
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/api/categories`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          // กรองข้อมูลเฉพาะรายการที่เป็นไมค์หรือยี่ห้อไมค์
          const filtered = data.filter((item: any) => {
            const catName = (item.name || item.category || item.category_name || "").toLowerCase();
            return catName.includes("mic") || catName.includes("hyperx") || catName.includes("shure") || catName.includes("rode") || catName.includes("fifine");
          });

          if (filtered.length > 0) {
            const formatted = filtered.map((item: any, idx: number) => {
              const catName = item.name || item.category || item.category_name || "Mic Brand";
              return {
                id: item.id || idx + 1,
                name: catName,
                items: `${item.count || 0} items`,
                icon: getCategoryIcon(),
              };
            });
            setCategories(formatted);
          }
        }
      }
    } catch (error) {
      console.log("Using local mic categories list fallback");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCategories();
    }, [])
  );

  // ==================== ADD NEW CATEGORY ====================
  const handleAddCategory = async () => {
    if (!newCatName.trim()) {
      showAlert("แจ้งเตือน", "กรุณากรอกชื่อยี่ห้อไมโครโฟน");
      return;
    }

    setSaving(true);
    // เติมคำว่า Mics ต่อท้ายอัตโนมัติหากผู้ใช้ไม่ได้พิมพ์มา
    let catName = newCatName.trim();
    if (!catName.toLowerCase().includes("mic")) {
      catName = `${catName} Mics`;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: catName }),
      });

      if (res.ok) {
        const createdData = await res.json().catch(() => ({}));
        
        setCategories((prev) => [
          ...prev,
          {
            id: createdData.id || Date.now(),
            name: catName,
            items: "0 items",
            icon: getCategoryIcon(),
          },
        ]);

        showAlert("สำเร็จ", "เพิ่มหมวดหมู่ไมโครโฟนเรียบร้อยแล้ว");
        setNewCatName("");
        setModalVisible(false);
      } else {
        showAlert("ข้อผิดพลาด", "ไม่สามารถเพิ่มหมวดหมู่บนเซิร์ฟเวอร์ได้");
      }
    } catch (error) {
      console.error("Add category error:", error);
      showAlert("ข้อผิดพลาด", "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Ionicons name="menu" size={28} color="#6C2BD9" />
        </TouchableOpacity>
        
        <Text style={styles.logo}>Microphones</Text>
        
        <TouchableOpacity style={styles.profile} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* CATEGORIES LIST */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {loading ? (
          <ActivityIndicator color="#6C2BD9" size="large" style={{ marginTop: 40 }} />
        ) : (
          categories.map((category) => (
            <View key={category.id} style={styles.categoryCard}>
              <View style={styles.iconBox}>
                <Ionicons name={category.icon as any} size={26} color="#6C2BD9" />
              </View>
              
              <View style={styles.textContainer}>
                <Text style={styles.categoryName} numberOfLines={1}>
                  {category.name}
                </Text>
                <Text style={styles.itemCount}>{category.items}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* MODAL ADD CATEGORY */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add Mic Brand</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Razer Mics"
              value={newCatName}
              onChangeText={setNewCatName}
              placeholderTextColor="#9CA3AF"
            />
            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#E5E7EB" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ color: "#374151", fontWeight: "600" }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#6C2BD9" }]}
                onPress={handleAddCategory}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={{ color: "#fff", fontWeight: "600" }}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MENU MODAL */}
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

      {/* BOTTOM NAV */}
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
    flex: 1,
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

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalCard: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 16, color: "#1F2937" },
  modalInput: {
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 20,
    color: "#1F2937",
  },
  modalBtnRow: { flexDirection: "row", justifyContent: "flex-end", gap: 12 },
  modalBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },

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

  bottom: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#fff", flexDirection: "row", justifyContent: "space-around", paddingVertical: 12, borderTopWidth: 1, borderColor: "#F3F4F6", height: 70 },
  menuItem: { alignItems: "center" },
  menuText: { color: "#6C2BD9", fontWeight: "bold", fontSize: 11, marginTop: 4 },
  menuGray: { color: "#C4B5FD", fontSize: 11, marginTop: 4 },
});