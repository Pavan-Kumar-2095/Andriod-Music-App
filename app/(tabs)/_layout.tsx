import AntDesign from "@expo/vector-icons/AntDesign";
import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#000", // black background
          borderTopWidth: 0, // remove top border
          height: 70, // optional: taller bar
        },
        tabBarActiveTintColor: "#0affe6", // active icon color (teal)
        tabBarInactiveTintColor: "#888", // inactive icon color (gray)
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <AntDesign name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <AntDesign name="search" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
