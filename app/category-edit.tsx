import { View, Text, useColorScheme } from 'react-native';
import React from 'react';
import { XStack } from 'tamagui';
import { Entypo } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

const CategoryEdit = () => {
  const colorScheme = useColorScheme();
  return (
    <View>
      <XStack>
        <Entypo
          name="chevron-down"
          size={24}
          color={Colors[colorScheme].tint}
        />
      </XStack>
      <Text>CategoryEdit</Text>
    </View>
  );
};

export default CategoryEdit;
