import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Index() {
  const router = useRouter();

  // 1. เพิ่ม State เก็บค่า Username, Password และสถานะการโหลด
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ฟังก์ชันแจ้งเตือนรองรับ Web และ Mobile
  const showAlert = (title: string, message: string) => {
    if (Platform.OS === "web") {
      alert(`${title}\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  // 2. ฟังก์ชันจัดการการ Log In
  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      showAlert("แจ้งเตือน", "กรุณากรอก Username และ Password ให้ครบถ้วน");
      return;
    }

    setLoading(true);

    try {
      // ตัวอย่าง: การเช็กแบบ Local Basic (ถ้าต้องการใช้ยิง API backend ให้ปลดล็อกคอมเมนต์ด้านล่าง)
      /*
      const res = await fetch("http://119.59.102.161:3061/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "เข้าสู่ระบบไม่สำเร็จ");
      */

      // สมมุติผ่านเงื่อนไข ให้เปลี่ยนหน้าไป /home
      router.replace("/home"); // ใช้ replace เพื่อไม่ให้ผู้ใช้กด Back กลับมาหน้า Login ได้ง่ายๆ
    } catch (error: any) {
      showAlert("เกิดข้อผิดพลาด", error.message || "ไม่สามารถเข้าสู่ระบบได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#7B2FF7", "#5B21B6"]}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.logo}>📦</Text>

        <Text style={styles.title}>Inventor.io</Text>

        <Text style={styles.subtitle}>Welcome Back</Text>

        {/* Input Username */}
        <View style={styles.inputBox}>
          <Ionicons
            name="person-outline"
            size={22}
            color="#7B2FF7"
          />
          <TextInput
            placeholder="Username"
            placeholderTextColor="#888"
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>

        {/* Input Password */}
        <View style={styles.inputBox}>
          <Ionicons
            name="lock-closed-outline"
            size={22}
            color="#7B2FF7"
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* Login Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Log In</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.footer}>
          Inventory Management System
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  card: {
    width: 360,
    maxWidth: "100%",
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 30,

    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    elevation: 12,
  },

  logo: {
    fontSize: 65,
    textAlign: "center",
    marginBottom: 10,
  },

  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#5B21B6",
    textAlign: "center",
  },

  subtitle: {
    textAlign: "center",
    color: "#888",
    marginTop: 5,
    marginBottom: 30,
    fontSize: 16,
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F3F3",
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },

  input: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 10,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#5B21B6",
    paddingVertical: 16,
    borderRadius: 15,
    marginTop: 15,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },

  footer: {
    textAlign: "center",
    color: "#888",
    marginTop: 25,
  },
});