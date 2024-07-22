import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import MyTabBar from '@/components/TabBar';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { bottom } = useSafeAreaInsets();

  return (
    <Tabs
      tabBar={props => <MyTabBar {...props} />}
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
      }}>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    flexDirection: 'row',
    paddingTop: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});
