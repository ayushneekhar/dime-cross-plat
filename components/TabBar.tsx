import { View, Pressable, useColorScheme, StyleSheet } from 'react-native';
import React from 'react';
import { FontAwesome6 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import TabBarIcon from './TabBarIcon';

function MyTabBar({ state, descriptors, navigation }) {
  const { bottom } = useSafeAreaInsets();
  const colorScheme = useColorScheme();

  const onAddPress = () => {
    navigation.navigate('add');
  };

  return (
    <View style={[styles.tabBar, { paddingBottom: bottom }]}>
      {state.routes.slice(0, state.routes.length / 2).map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <Pressable
            key={index}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            hitSlop={25}>
            <TabBarIcon
              route={route.name}
              color={
                isFocused
                  ? Colors[colorScheme].tint
                  : Colors[colorScheme].tabIconDefault
              }
            />
          </Pressable>
        );
      })}
      <Pressable onPress={onAddPress}>
        <View
          style={[
            styles.addButtonContainer,
            { backgroundColor: Colors[colorScheme].tint },
          ]}>
          <FontAwesome6
            name="plus"
            size={24}
            color={colorScheme === 'light' ? 'white' : 'black'}
          />
        </View>
      </Pressable>
      {state.routes.slice(state.routes.length / 2).map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index + 2;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <Pressable
            key={index}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            hitSlop={25}>
            <TabBarIcon
              route={route.name}
              color={
                isFocused
                  ? Colors[colorScheme].tint
                  : Colors[colorScheme].tabIconDefault
              }
            />
          </Pressable>
        );
      })}
    </View>
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
  addButtonContainer: {
    width: 80,
    height: 45,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
});

export default MyTabBar;
