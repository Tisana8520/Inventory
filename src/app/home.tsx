import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router"; // อิมพอร์ต Link สำหรับเปลี่ยนหน้า
import { useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Home() {
  const [menuVisible, setMenuVisible] = useState(false);

  // สเตตัสสำหรับชื่อผู้ใช้งานหลัก (แสดงบนหน้าจอ)
  const [userName, setUserName] = useState("Tisana"); 

  const stats = [
    { value: "741", title: "NEW ITEMS" },
    { value: "123", title: "NEW ORDERS" },
    { value: "12", title: "REFUNDS" },
    { value: "1", title: "MESSAGE" },
    { value: "4", title: "GROUPS" },
  ];

  // ข้อมูลสินค้า (ปรับให้เป็นค่าคงที่ ไม่ต้องใช้ State เปลี่ยนแปลง)
  const products = [
    { id: 1, name: "HyperX SoloCast", stock: 15, price: "฿1,790", icon: "mic-outline" as const },
    { id: 2, name: "Fantech Leviosa MCX01", stock: 24, price: "฿1,590", icon: "mic-outline" as const },
    { id: 3, name: "Shure SM7B Cardioid", stock: 5, price: "฿22,864", icon: "mic-outline" as const },
  ];

  const menuItems = ["Home", "Products", "Categories", "Stores", "Finances", "Settings"];

  return (
    <View style={styles.container}>
      {/* ==================== HEADER ==================== */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Ionicons name="menu" size={28} color="#6C2BD9" />
        </TouchableOpacity>

        <Text style={styles.logo}>Inventor.io</Text>

        {/* ปุ่มรูปคนลิงก์ไปหน้า settings */}
        <Link href="/settings" asChild>
          <TouchableOpacity style={styles.profile}>
            <Ionicons name="person" size={20} color="#fff" />
          </TouchableOpacity>
        </Link>
      </View>

      {/* ==================== MAIN CONTENT ==================== */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ชื่อผู้ใช้งานปัจจุบัน */}
        <Text style={{ marginHorizontal: 24, fontSize: 14, color: "#6B7280" }}>
          Welcome back, <Text style={{ fontWeight: "bold", color: "#6C2BD9" }}>{userName}</Text>
        </Text>

        {/* Recent Activity */}
        <Text style={styles.section}>Recent activity</Text>

        <View style={styles.grid}>
          {stats.map((item, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.number}>{item.value}</Text>
              <Text style={styles.qtyText}>Qty</Text>
              <Text style={styles.cardTitle}>{item.title}</Text>
            </View>
          ))}

          {/* 🔥 แก้ไขจุดที่ 1: ใช้ Link ครอบปุ่ม View more เพื่อให้กดลิงก์ไปหน้า Categories ได้ */}
          <Link href="/categories" asChild>
            <TouchableOpacity style={styles.cardEmpty}>
              <View style={styles.viewMoreCircle}>
                <Ionicons name="chevron-forward" size={18} color="#6C2BD9" />
              </View>
              <Text style={styles.viewMoreText}>View more</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Recent Products */}
        <Text style={styles.section}>Recent Products</Text>
        {products.map((product) => (
          <View key={product.id} style={styles.productCard}>
            <View style={styles.productIconBg}>
              <Ionicons name={product.icon} size={26} color="#6C2BD9" />
            </View>
            <View style={styles.productDetails}>
              <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
              <Text style={styles.productStock}>Stock : {product.stock} pcs</Text>
            </View>
            <Text style={styles.productPrice}>{product.price}</Text>
          </View>
        ))}

        {/* Sales */}
        <Text style={styles.section}>Sales</Text>

        <View style={styles.chartContainer}>
          <View style={styles.chartInside}>
            <View style={styles.barContainer}>
              <View style={[styles.bar, { height: 100 }]} />
              <Text style={styles.barLabel}>Confirmed</Text>
            </View>

            <View style={styles.barContainer}>
              <View style={[styles.bar, { height: 140 }]} />
              <Text style={styles.barLabel}>Packed</Text>
            </View>

            <View style={styles.barContainer}>
              <View style={[styles.bar, { height: 60 }]} />
              <Text style={styles.barLabel}>Refunded</Text>
            </View>

            <View style={styles.barContainer}>
              <View style={[styles.bar, { height: 150 }]} />
              <Text style={styles.barLabel}>Shipped</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* ==================== BOTTOM MENU ==================== */}
      <View style={styles.bottom}>
        <Link href="/home" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="home" size={24} color="#6C2BD9" />
            <Text style={styles.menuText}>Home</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/add" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="add-circle-outline" size={24} color="#C4B5FD" />
            <Text style={styles.menuGray}>Add</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/product" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="cube-outline" size={24} color="#C4B5FD" />
            <Text style={styles.menuGray}>Product</Text>
          </TouchableOpacity>
        </Link>

        {/* 🔥 แก้ไขจุดที่ 2: เปลี่ยนลิงก์ปุ่มขวาสุดจาก Settings ให้เป็น Categories แทน */}
        <Link href="/categories" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="grid-outline" size={24} color="#C4B5FD" />
            <Text style={styles.menuGray}>Categories</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* ==================== FULLSCREEN PURPLE MENU LAYER ==================== */}
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
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 20,
    height: 50,
  },
  logo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4C1D95",
  },
  profile: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#6C2BD9",
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginHorizontal: 24,
    marginTop: 20,
    marginBottom: 15,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 24,
  },
  card: {
    width: "30%",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  cardEmpty: {
    width: "30%",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  number: {
    color: "#6C2BD9",
    fontSize: 20,
    fontWeight: "bold",
  },
  qtyText: {
    color: "#9CA3AF",
    fontSize: 11,
    marginBottom: 8,
  },
  cardTitle: {
    color: "#1F2937",
    fontWeight: "600",
    fontSize: 10,
    textAlign: "center",
  },
  viewMoreCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#E9D5FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  viewMoreText: {
    color: "#6C2BD9",
    fontSize: 11,
    fontWeight: "600",
  },
  productCard: {
    backgroundColor: "#fff",
    marginHorizontal: 24,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  productIconBg: {
    width: 46,
    height: 46,
    borderRadius: 10,
    backgroundColor: "#E9D5FF",
    justifyContent: "center",
    alignItems: "center",
  },
  productDetails: {
    flex: 1,
    marginLeft: 16,
    paddingRight: 8,
  },
  productName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
  },
  productStock: {
    color: "#6B7280",
    fontSize: 13,
    marginTop: 4,
  },
  productPrice: {
    color: "#6C2BD9",
    fontWeight: "bold",
    fontSize: 16,
  },
  chartContainer: {
    backgroundColor: "#E9D5FF",
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    height: 220,
    marginBottom: 100,
  },
  chartInside: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
  },
  barContainer: {
    alignItems: "center",
    width: "22%",
  },
  bar: {
    width: 14,
    backgroundColor: "#6C2BD9",
    borderRadius: 10,
  },
  barLabel: {
    fontSize: 11,
    color: "#4B5563",
    marginTop: 8,
    textAlign: "center",
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
    height: 70,
  },
  menuItem: {
    alignItems: "center",
  },
  menuText: {
    color: "#6C2BD9",
    fontWeight: "bold",
    fontSize: 11,
    marginTop: 4,
  },
  menuGray: {
    color: "#C4B5FD",
    fontSize: 11,
    marginTop: 4,
  },
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