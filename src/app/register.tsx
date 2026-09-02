import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
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
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterScreen() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const showAlert = (title: string, message: string, onOk?: () => void) => {
    if (Platform.OS === "web") {
      alert(`${title}\n${message}`);
      if (onOk) onOk();
    } else {
      Alert.alert(title, message, [{ text: "ตกลง", onPress: onOk }]);
    }
  };

  const handleRegister = async () => {
    if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
      showAlert("แจ้งเตือน", "กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    if (password !== confirmPassword) {
      showAlert("ข้อผิดพลาด", "รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    setLoading(true);
    const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL || "http://119.59.102.161:3061";
    const payload = { username: username.trim(), password: password.trim() };

    try {
      let res = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 404) {
        res = await fetch(`${BASE_URL}/api/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const contentType = res.headers.get("content-type");
      let data: any = {};
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      }

      if (res.ok || data.success) {
        showAlert("สำเร็จ", "สมัครสมาชิกเรียบร้อยแล้ว กรุณาเข้าสู่ระบบ", () => {
          router.replace("/");
        });
      } else {
        showAlert("ข้อผิดพลาด", data.message || "ไม่สามารถลงทะเบียนได้");
      }
    } catch (error) {
      console.error("Register Error:", error);
      showAlert("เชื่อมต่อล้มเหลว", "ไม่สามารถติดต่อ Server ได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#6366F1", "#4C1D95"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.card}>
          <View style={styles.iconWrapper}>
            <Ionicons name="person-add" size={48} color="#D97706" />
          </View>

          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>

          {/* Username */}
          <View style={styles.inputBox}>
            <Ionicons name="person-outline" size={20} color="#9CA3AF" />
            <TextInput
              placeholder="Username"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>

          {/* Password */}
          <View style={styles.inputBox}>
            <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* Confirm Password */}
          <View style={styles.inputBox}>
            <Ionicons name="checkmark-circle-outline" size={20} color="#9CA3AF" />
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.8 }]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          {/* Back to Login */}
          <View style={styles.loginBox}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <Link href="/" asChild>
              <TouchableOpacity>
                <Text style={styles.loginLink}>Log In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: 380,
    maxWidth: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 24,
    paddingHorizontal: 28,
    paddingVertical: 36,
    alignItems: "center",
    ...Platform.select({
      web: {
        boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.15)",
      },
      default: {
        elevation: 10,
      },
    }),
  },
  iconWrapper: {
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#5B21B6",
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 4,
    marginBottom: 24,
    fontSize: 14,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 48,
    width: "100%",
  },
  input: {
    flex: 1,
    paddingLeft: 10,
    fontSize: 15,
    color: "#1F2937",
  },
  button: {
    backgroundColor: "#5B21B6",
    height: 48,
    borderRadius: 12,
    marginTop: 8,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  loginBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  loginText: {
    color: "#6B7280",
    fontSize: 14,
  },
  loginLink: {
    color: "#5B21B6",
    fontWeight: "bold",
    fontSize: 14,
  },
});