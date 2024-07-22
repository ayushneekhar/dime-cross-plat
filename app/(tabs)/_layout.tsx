import { Tabs } from "expo-router";
import React from "react";
import { View, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FontAwesome5, FontAwesome6 } from "@expo/vector-icons";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { bottom } = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: [
          styles.tabBar,
          {
            height: 100,
            paddingBottom: bottom,
            backgroundColor: Colors[colorScheme].background,
          },
        ],
        tabBarActiveTintColor: Colors[colorScheme].tint,
        tabBarInactiveTintColor: Colors[colorScheme].tabIconDefault,
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="receipt" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="chart-simple" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          tabBarIcon: ({ color }) => (
            <View
              style={[
                styles.addButtonContainer,
                { backgroundColor: Colors[colorScheme].tint },
              ]}
            >
              <FontAwesome6
                name="plus"
                size={24}
                color={colorScheme === "light" ? "white" : "black"}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="charts"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="chart-pie" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="budgets"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="cog" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    // position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  addButtonContainer: {
    width: 80,
    height: 45,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
});
