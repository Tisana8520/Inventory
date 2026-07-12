// src/app/product.tsx
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useState } from "react";
import { Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ProductsScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const menuItems = ["Home", "Products", "Categories", "Stores", "Finances", "Settings"];

  // ใช้ state เพื่อให้สามารถแก้ไขข้อมูลได้จริงๆ
  const [products, setProducts] = useState([
    { id: 1, name: "HyperX SoloCast", stock: 15, price: "฿1,790" },
    { id: 2, name: "Fantech Leviosa Microphone MCX01", stock: 24, price: "฿1,590" },
    { id: 3, name: "Shure SM7B Cardioid Dynamic Microphone", stock: 5, price: "฿22,864" },
  ]);

  const handleEdit = (id: number) => {
    Alert.alert("แก้ไขสินค้า", `คุณกำลังแก้ไขสินค้า ID: ${id}`);
  };

  const handleDelete = (id: number) => {
    Alert.alert("ยืนยันการลบ", "คุณต้องการลบสินค้านี้ใช่หรือไม่?", [
      { text: "ยกเลิก", style: "cancel" },
      { text: "ลบ", onPress: () => setProducts(products.filter(p => p.id !== id)), style: "destructive" }
    ]);
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.7} onPress={() => setMenuVisible(true)}>
          <Ionicons name="menu" size={28} color="#6C2BD9" />
        </TouchableOpacity>
        <Text style={styles.logo}>Products</Text>
        <TouchableOpacity style={styles.profile} activeOpacity={0.8}>
          <Ionicons name="person" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* ACTION BAR */}
      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.searchButton} activeOpacity={0.7}>
          <Ionicons name="search-outline" size={22} color="#6C2BD9" />
        </TouchableOpacity>
        <Link href="/add" asChild>
          <TouchableOpacity style={styles.addProductBtn} activeOpacity={0.8}>
            <Ionicons name="add" size={18} color="#fff" style={{ marginRight: 4 }} />
            <Text style={styles.addProductText}>Add Product</Text>
          </TouchableOpacity>
        </Link>
        <TouchableOpacity style={styles.filterButton} activeOpacity={0.7}>
          <Text style={styles.filterText}>Filter</Text>
          <Ionicons name="funnel" size={14} color="#6C2BD9" style={{ marginLeft: 4 }} />
        </TouchableOpacity>
      </View>

      {/* PRODUCT LIST */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.sectionTitle}>Product Inventory ({products.length})</Text>
        
        {products.map((product) => (
          <TouchableOpacity 
            key={product.id} 
            style={styles.productCard}
            onPress={() => handleEdit(product.id)}
            onLongPress={() => handleDelete(product.id)}
            activeOpacity={0.8}
          >
            <View style={styles.cardLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="mic-outline" size={22} color="#6C2BD9" />
              </View>
              <View style={styles.productDetails}>
                {/* เอา numberOfLines ออกเพื่อให้ข้อความยาวขึ้นบรรทัดใหม่ได้ */}
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productStock}>Stock : {product.stock} pcs</Text>
              </View>
            </View>
            <Text style={styles.productPrice}>{product.price}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* BOTTOM NAV */}
      <View style={styles.bottom}>
        <Link href="/home" asChild><TouchableOpacity style={styles.menuItem}><Ionicons name="home-outline" size={22} color="#C4B5FD" /><Text style={styles.menuGray}>Home</Text></TouchableOpacity></Link>
        <Link href="/add" asChild><TouchableOpacity style={styles.menuItem}><Ionicons name="add-circle-outline" size={22} color="#C4B5FD" /><Text style={styles.menuGray}>Add</Text></TouchableOpacity></Link>
        <Link href="/product" asChild><TouchableOpacity style={styles.menuItem}><Ionicons name="cube" size={22} color="#6C2BD9" /><Text style={styles.menuText}>Product</Text></TouchableOpacity></Link>
        <Link href="/categories" asChild><TouchableOpacity style={styles.menuItem}><Ionicons name="grid-outline" size={22} color="#C4B5FD" /><Text style={styles.menuGray}>Settings</Text></TouchableOpacity></Link>
      </View>

      {/* MENU MODAL */}
      <Modal animationType="fade" transparent={true} visible={menuVisible} onRequestClose={() => setMenuVisible(false)}>
        <View style={styles.menuOverlay}>
          <View style={styles.overlayHeader}>
            <TouchableOpacity onPress={() => setMenuVisible(false)}><Ionicons name="close" size={28} color="#fff" /></TouchableOpacity>
            <Text style={styles.overlayLogo}>Inventor.io</Text>
            <View style={{ width: 28 }} />
          </View>
          <View style={styles.overlayLinksContainer}>
            {menuItems.map((menu, idx) => <TouchableOpacity key={idx} onPress={() => setMenuVisible(false)}><Text style={styles.overlayMenuText}>{menu}</Text></TouchableOpacity>)}
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={() => setMenuVisible(false)}><Text style={styles.logoutText}>Log out</Text></TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB", paddingTop: 50 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, marginBottom: 15, height: 50 },
  logo: { fontSize: 20, fontWeight: "bold", color: "#1F2937" },
  profile: { width: 34, height: 34, borderRadius: 17, backgroundColor: "#6C2BD9", justifyContent: "center", alignItems: "center" },
  actionBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, marginBottom: 15 },
  searchButton: { padding: 4 },
  addProductBtn: { backgroundColor: "#4C1D95", flexDirection: "row", alignItems: "center", paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  addProductText: { color: "#fff", fontWeight: "600", fontSize: 13 },
  filterButton: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#E5E7EB", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 15, backgroundColor: "#fff" },
  filterText: { color: "#6B7280", fontSize: 13 },
  scrollContainer: { paddingHorizontal: 24, paddingBottom: 110 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#1F2937", marginBottom: 14, marginTop: 10 },
  productCard: { backgroundColor: "#fff", borderRadius: 16, padding: 14, marginBottom: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderWidth: 1, borderColor: "#F3F4F6" },
  cardLeft: { flexDirection: "row", alignItems: "center", flex: 1, marginRight: 10 },
  iconContainer: { width: 40, height: 40, borderRadius: 10, backgroundColor: "#EDE9FE", justifyContent: "center", alignItems: "center" },
  productDetails: { marginLeft: 14, justifyContent: "center", flex: 1 },
  productName: { fontSize: 14, fontWeight: "600", color: "#1F2937", marginBottom: 2 },
  productStock: { fontSize: 12, color: "#9CA3AF" },
  productPrice: { fontSize: 14, fontWeight: "bold", color: "#6C2BD9", minWidth: 60, textAlign: 'right' },
  bottom: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#fff", flexDirection: "row", justifyContent: "space-around", paddingVertical: 12, borderTopWidth: 1, borderColor: "#F3F4F6", height: 75 },
  menuItem: { alignItems: "center" },
  menuText: { color: "#6C2BD9", fontWeight: "bold", fontSize: 11, marginTop: 4 },
  menuGray: { color: "#C4B5FD", fontSize: 11, marginTop: 4 },
  menuOverlay: { flex: 1, backgroundColor: "#4C1D95", paddingTop: 50, paddingHorizontal: 24, justifyContent: "space-between", paddingBottom: 40 },
  overlayHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", height: 50 },
  overlayLogo: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  overlayLinksContainer: { alignItems: "center", justifyContent: "center", gap: 25 },
  overlayMenuText: { color: "#fff", fontSize: 22, fontWeight: "600" },
  logoutButton: { alignItems: "center", paddingVertical: 10 },
  logoutText: { color: "#fff", fontSize: 16, fontWeight: "500", opacity: 0.9 },
});