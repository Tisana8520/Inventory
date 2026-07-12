import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Index() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#7B2FF7", "#5B21B6"]}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.logo}>📦</Text>

        <Text style={styles.title}>Inventor.io</Text>

        <Text style={styles.subtitle}>
          Welcome Back
        </Text>

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
          />
        </View>

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
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/home")}
        >
          <Text style={styles.buttonText}>Log In</Text>
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