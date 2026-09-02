import { Ionicons } from "@expo/vector-icons";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
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
import { SafeAreaView } from "react-native-safe-area-context";

const MENU_ITEMS = [
  { name: "Home", path: "/home" },
  { name: "Products", path: "/product" },
  { name: "Categories", path: "/categories" },
  { name: "Add Microphone", path: "/add" },
  { name: "Settings", path: "/settings" },
];

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL || "http://119.59.102.161:3061";

export default function EditProductScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const productId = (params.id as string) || (params.itemCode as string) || "";

  const [form, setForm] = useState({
    itemCode: productId,
    name: (params.name as string) || "",
    stockSize: (params.stock as string) || "0",
    category: (params.category as string) || "",
    store: (params.location as string) || "",
    status: (params.status as string) || "Active",
    imageUrl: (params.image as string) || "",
  });

  useEffect(() => {
    if (productId) {
      setForm({
        itemCode: productId,
        name: (params.name as string) || "",
        stockSize: (params.stock as string) || "0",
        category: (params.category as string) || "",
        store: (params.location as string) || "",
        status: (params.status as string) || "Active",
        imageUrl: (params.image as string) || "",
      });
    }
  }, [params]);

  const showAlert = (title: string, message: string, onOk?: () => void) => {
    if (Platform.OS === "web") {
      alert(`${title}\n${message}`);
      if (onOk) onOk();
    } else {
      Alert.alert(title, message, [{ text: "ตกลง", onPress: onOk }]);
    }
  };

  // ==================== HANDLE UPDATE API (PUT) ====================
  const handleUpdate = async () => {
    if (!form.itemCode) {
      showAlert("ข้อผิดพลาด", "ไม่พบ รหัสสินค้า (Item Code)");
      return;
    }

    if (!form.name.trim()) {
      showAlert("ข้อผิดพลาด", "กรุณากรอกชื่อสินค้า (Name)");
      return;
    }

    setLoading(true);

    const payload = {
      name: form.name.trim(),
      stock: Number(form.stockSize) || 0,
      category: form.category.trim() || null,
      location_text: form.store.trim() || null,
      badge_status: form.status || "Active",
      image_url: form.imageUrl.trim() || null,
    };

    try {
      let response = await fetch(`${BASE_URL}/api/products/${form.itemCode}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.status === 404) {
        response = await fetch(`${BASE_URL}/products/${form.itemCode}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const contentType = response.headers.get("content-type");
      let data: any = {};

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const textError = await response.text();
        if (!response.ok) {
          throw new Error(`Server Error (${response.status}): ${textError}`);
        }
      }

      if (response.ok || data.success) {
        showAlert("สำเร็จ!", "แก้ไขข้อมูลสินค้าเรียบร้อยแล้ว", () => {
          router.push("/product");
        });
      } else {
        showAlert("เกิดข้อผิดพลาด", data.error || data.message || "ไม่สามารถแก้ไขสินค้าได้");
      }
    } catch (error: any) {
      console.error("Fetch Error:", error);
      showAlert("เกิดข้อผิดพลาด", "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์เพื่อบันทึกข้อมูลได้");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setMenuVisible(false);
    router.replace("/");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Ionicons name="menu" size={28} color="#6C2BD9" />
        </TouchableOpacity>

        <Text style={styles.logo}>Edit product</Text>

        <Link href="/settings" asChild>
          <TouchableOpacity style={styles.profile}>
            <Ionicons name="person" size={18} color="#fff" />
          </TouchableOpacity>
        </Link>
      </View>

      {/* FORM CONTENT */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Item code (Cannot edit)</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={form.itemCode}
            editable={false}
          />
        </View>

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
          <Text style={styles.label}>Category</Text>
          <TextInput
            style={styles.input}
            value={form.category}
            onChangeText={(text) => setForm({ ...form, category: text })}
            placeholder="Enter category"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Stock size</Text>
          <TextInput
            style={styles.input}
            value={String(form.stockSize)}
            onChangeText={(text) => setForm({ ...form, stockSize: text })}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Location / Store</Text>
          <TextInput
            style={styles.input}
            value={form.store}
            onChangeText={(text) => setForm({ ...form, store: text })}
            placeholder="Enter location"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Image URL</Text>
          <TextInput
            style={styles.input}
            value={form.imageUrl}
            onChangeText={(text) => setForm({ ...form, imageUrl: text })}
            placeholder="https://..."
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Update Button */}
        <TouchableOpacity
          style={[styles.saveButton, loading && { opacity: 0.7 }]}
          onPress={handleUpdate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Update product</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

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
            <Ionicons name="cube" size={22} color="#6C2BD9" />
            <Text style={styles.menuText}>Product</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/categories" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="grid-outline" size={22} color="#C4B5FD" />
            <Text style={styles.menuGray}>Categories</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* MENU MODAL */}
      <Modal animationType="fade" transparent={true} visible={menuVisible} onRequestClose={() => setMenuVisible(false)}>
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
  scrollContent: { paddingHorizontal: 24, paddingBottom: 120 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "600", color: "#1F2937", marginBottom: 8 },
  input: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: "#1F2937",
  },
  disabledInput: { backgroundColor: "#E5E7EB", color: "#6B7280" },
  saveButton: {
    backgroundColor: "#4C1D95",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
    elevation: 3,
  },
  saveButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
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
  menuText: { color: "#6C2BD9", fontWeight: "bold", fontSize: 11, marginTop: 4 },
  menuGray: { color: "#C4B5FD", fontSize: 11, marginTop: 4 },
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