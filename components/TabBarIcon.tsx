import { View, Text, useColorScheme } from "react-native";
import React from "react";
import { FontAwesome5, FontAwesome6 } from "@expo/vector-icons";

function TabBarIcon({ route, color }) {
  const colorScheme = useColorScheme();

  switch (route) {
    case "index":
      return <FontAwesome5 name="receipt" size={24} color={color} />;
    case "explore":
      return <FontAwesome6 name="chart-simple" size={24} color={color} />;
    case "charts":
      return <FontAwesome5 name="chart-pie" size={24} color={color} />;
    case "budgets":
      return <FontAwesome5 name="cog" size={24} color={color} />;
  }
}

export default TabBarIcon;
