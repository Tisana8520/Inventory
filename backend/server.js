import { Ionicons } from "@expo/vector-icons";
import { Link, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Product {
  id: string | number;
  name: string;
  stock: number;
  price: number;
  category?: string;
  image_url?: string;
}

const API_BASE_URL = process.env.EXPO_PUBLIC_BASE_URL || "http://119.59.102.161:3061";

export default function ProductScreen() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);

  // State สำหรับ Modal แก้ไขสินค้า
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  const menuItems = ["Home", "Products", "Categories", "Stores", "Finances", "Settings"];

  const showAlert = (title: string, message: string, onOk?: () => void) => {
    if (Platform.OS === "web") {
      alert(`${title}\n${message}`);
      if (onOk) onOk();
    } else {
      Alert.alert(title, message, [{ text: "ตกลง", onPress: onOk }]);
    }
  };

  // ==================== FETCH PRODUCTS ====================
  const fetchProducts = async () => {
    try {
      setLoading(true);
      let res;
      
      try {
        res = await fetch(`${API_BASE_URL}/api/products`);
      } catch (e) {
        res = await fetch(`${API_BASE_URL}/products`);
      }

      if (res && res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const formatted = data.map((item: any, idx: number) => {
            let imgUrl = item.image_url || item.image || null;

            if (imgUrl && imgUrl.startsWith("/")) {
              imgUrl = `${API_BASE_URL}${imgUrl}`;
            } else if (!imgUrl || !imgUrl.startsWith("http")) {
              // รูป Default กรณีไม่มีรูปภาพ
              imgUrl = "https://cdn-icons-png.flaticon.com/512/3083/3083174.png";
            }

            return {
              id: item.id || item.P_ID || item.M_ID || idx + 1,
              name: item.name || item.M_Name || "Microphone",
              stock: Number(item.stock) || 0,
              price: Number(item.price) || 0,
              category: item.category || "General Mics",
              image_url: imgUrl,
            };
          });
          setProducts(formatted);
        }
      }
    } catch (error) {
      console.log("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [])
  );

  // ==================== DELETE PRODUCT ====================
  const handleDelete = (id: string | number, name: string) => {
    const confirmDelete = async () => {
      try {
        let res = await fetch(`${API_BASE_URL}/api/products/${id}`, { method: "DELETE" });
        if (!res.ok) {
          await fetch(`${API_BASE_URL}/products/${id}`, { method: "DELETE" });
        }
      } catch (error) {
        console.log("Delete backend error");
      } finally {
        setProducts((prev) => prev.filter((item) => item.id !== id));
        showAlert("สำเร็จ", `ลบรายการ "${name}" เรียบร้อยแล้ว`);
      }
    };

    if (Platform.OS === "web") {
      if (confirm(`คุณต้องการลบ "${name}" ใช่หรือไม่?`)) {
        confirmDelete();
      }
    } else {
      Alert.alert("ยืนยันการลบ", `คุณต้องการลบ "${name}" ใช่หรือไม่?`, [
        { text: "ยกเลิก", style: "cancel" },
        { text: "ลบ", style: "destructive", onPress: confirmDelete },
      ]);
    }
  };

  // ==================== OPEN EDIT MODAL ====================
  const openEditModal = (product: Product) => {
    setEditingProduct({ ...product });
    setEditModalVisible(true);
  };

  // ==================== SAVE EDITED PRODUCT ====================
  const handleSaveEdit = async () => {
    if (!editingProduct || !editingProduct.name.trim()) {
      showAlert("แจ้งเตือน", "กรุณากรอกชื่อสินค้า");
      return;
    }

    setSaving(true);
    try {
      let res = await fetch(`${API_BASE_URL}/api/products/${editingProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProduct),
      });

      if (!res.ok) {
        await fetch(`${API_BASE_URL}/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingProduct),
        });
      }
    } catch (error) {
      console.log("Edit backend error");
    } finally {
      setProducts((prev) =>
        prev.map((item) => (item.id === editingProduct.id ? editingProduct : item))
      );
      showAlert("สำเร็จ", "อัปเดตข้อมูลสินค้าเรียบร้อยแล้ว");
      setEditModalVisible(false);
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

        <Text style={styles.logo}>Products</Text>

        <Link href="/settings" asChild>
          <TouchableOpacity style={styles.profile}>
            <Ionicons name="person" size={18} color="#fff" />
          </TouchableOpacity>
        </Link>
      </View>

      {/* TOP ACTION BAR */}
      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="search" size={20} color="#6B7280" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push("/add")}
        >
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={styles.addBtnText}>Add Product</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.filterBtn}>
          <Text style={styles.filterText}>Filter</Text>
          <Ionicons name="filter" size={16} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* TITLE & COUNT */}
      <Text style={styles.sectionTitle}>Product Inventory ({products.length})</Text>

      {/* PRODUCT LIST */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {loading ? (
          <ActivityIndicator color="#6C2BD9" size="large" style={{ marginTop: 40 }} />
        ) : (
          products.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardLeft}>
                <View style={styles.imgBox}>
                  {item.image_url ? (
                    <Image source={{ uri: item.image_url }} style={styles.img} />
                  ) : (
                    <Ionicons name="mic" size={26} color="#4B5563" />
                  )}
                </View>
                <View style={styles.info}>
                  <Text style={styles.prodName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.prodStock}>Stock : {item.stock} pcs</Text>
                </View>
              </View>

              <View style={styles.cardRight}>
                <Text style={styles.prodPrice}>
                  {item.price ? item.price.toLocaleString() : "-"}
                </Text>

                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={[styles.actionIconBtn, { backgroundColor: "#EEF2FF" }]}
                    onPress={() => openEditModal(item)}
                  >
                    <Ionicons name="pencil" size={16} color="#4F46E5" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionIconBtn, { backgroundColor: "#FEE2E2" }]}
                    onPress={() => handleDelete(item.id, item.name)}
                  >
                    <Ionicons name="trash-outline" size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* EDIT PRODUCT MODAL */}
      <Modal visible={editModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Edit Product</Text>

            {editingProduct && (
              <>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editingProduct.name}
                  onChangeText={(text) =>
                    setEditingProduct({ ...editingProduct, name: text })
                  }
                  placeholder="Microphone Model"
                />

                <View style={{ flexDirection: "row", gap: 10 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.inputLabel}>Stock</Text>
                    <TextInput
                      style={styles.modalInput}
                      keyboardType="numeric"
                      value={String(editingProduct.stock)}
                      onChangeText={(text) =>
                        setEditingProduct({
                          ...editingProduct,
                          stock: Number(text) || 0,
                        })
                      }
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.inputLabel}>Price (THB)</Text>
                    <TextInput
                      style={styles.modalInput}
                      keyboardType="numeric"
                      value={String(editingProduct.price)}
                      onChangeText={(text) =>
                        setEditingProduct({
                          ...editingProduct,
                          price: Number(text) || 0,
                        })
                      }
                    />
                  </View>
                </View>

                <Text style={styles.inputLabel}>Image URL</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editingProduct.image_url}
                  onChangeText={(text) =>
                    setEditingProduct({
                      ...editingProduct,
                      image_url: text,
                    })
                  }
                  placeholder="https://..."
                />

                <View style={styles.modalBtnRow}>
                  <TouchableOpacity
                    style={[styles.modalBtn, { backgroundColor: "#E5E7EB" }]}
                    onPress={() => setEditModalVisible(false)}
                  >
                    <Text style={{ color: "#374151", fontWeight: "600" }}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalBtn, { backgroundColor: "#6C2BD9" }]}
                    onPress={handleSaveEdit}
                    disabled={saving}
                  >
                    {saving ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={{ color: "#fff", fontWeight: "600" }}>Save</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            )}
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
            <TouchableOpacity onPress={() => setMenuVisible(false)}>
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
            <Ionicons name="cube" size={22} color="#6C2BD9" />
            <Text style={styles.menuText}>Products</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/categories" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="grid-outline" size={22} color="#C4B5FD" />
            <Text style={styles.menuGray}>Categories</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB", paddingTop: 50 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, marginBottom: 16 },
  logo: { fontSize: 20, fontWeight: "bold", color: "#1F2937" },
  profile: { width: 34, height: 34, borderRadius: 17, backgroundColor: "#6C2BD9", justifyContent: "center", alignItems: "center" },
  
  actionBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 24, marginBottom: 20 },
  iconBtn: { width: 38, height: 38, borderRadius: 10, backgroundColor: "#F3F4F6", justifyContent: "center", alignItems: "center" },
  addBtn: { flexDirection: "row", alignItems: "center", backgroundColor: "#311076", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, gap: 6 },
  addBtnText: { color: "#fff", fontWeight: "600", fontSize: 13 },
  filterBtn: { flexDirection: "row", alignItems: "center", backgroundColor: "#F3F4F6", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, gap: 6 },
  filterText: { fontSize: 13, color: "#4B5563" },

  sectionTitle: { fontSize: 15, fontWeight: "bold", color: "#1F2937", paddingHorizontal: 24, marginBottom: 12 },

  card: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#F3F4F6", marginHorizontal: 24, padding: 14, borderRadius: 16, marginBottom: 12 },
  cardLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  imgBox: { width: 50, height: 50, backgroundColor: "#fff", borderRadius: 10, justifyContent: "center", alignItems: "center", marginRight: 12 },
  img: { width: 40, height: 40, resizeMode: "contain" },
  info: { flex: 1 },
  prodName: { fontSize: 15, fontWeight: "bold", color: "#1F2937", marginBottom: 2 },
  prodStock: { fontSize: 12, color: "#6B7280" },

  cardRight: { alignItems: "flex-end", gap: 6 },
  prodPrice: { fontSize: 15, fontWeight: "bold", color: "#4C1D95" },
  actionRow: { flexDirection: "row", gap: 6 },
  actionIconBtn: { width: 28, height: 28, borderRadius: 6, justifyContent: "center", alignItems: "center" },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center", paddingHorizontal: 20 },
  modalCard: { width: "100%", maxWidth: 380, backgroundColor: "#fff", borderRadius: 16, padding: 24 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 16, color: "#1F2937" },
  inputLabel: { fontSize: 13, fontWeight: "600", color: "#374151", marginBottom: 4 },
  modalInput: { backgroundColor: "#F3F4F6", borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, marginBottom: 14, color: "#1F2937" },
  modalBtnRow: { flexDirection: "row", justifyContent: "flex-end", gap: 12, marginTop: 10 },
  modalBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },

  menuOverlay: { flex: 1, backgroundColor: "#4C1D95", paddingTop: 50, paddingHorizontal: 24, justifyContent: "space-between", paddingBottom: 40 },
  overlayHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", height: 50 },
  overlayLogo: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  overlayLinksContainer: { alignItems: "center", justifyContent: "center", gap: 25 },
  overlayMenuText: { color: "#fff", fontSize: 22, fontWeight: "600" },
  logoutButton: { alignItems: "center", paddingVertical: 10 },
  logoutText: { color: "#fff", fontSize: 16, fontWeight: "500", opacity: 0.9 },

  bottom: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#fff", flexDirection: "row", justifyContent: "space-around", paddingVertical: 12, borderTopWidth: 1, borderColor: "#F3F4F6", height: 70 },
  menuItem: { alignItems: "center" },
  menuText: { color: "#6C2BD9", fontWeight: "bold", fontSize: 11, marginTop: 4 },
  menuGray: { color: "#C4B5FD", fontSize: 11, marginTop: 4 },
});