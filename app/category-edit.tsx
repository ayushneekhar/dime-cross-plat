import { useColorScheme, FlatList } from 'react-native';
import React, { useState } from 'react';
import { Button, Stack, XStack, YStack } from 'tamagui';
import { Entypo } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { ThemedText } from '@/components/ThemedText';
import { useNavigation } from 'expo-router';
import { useGetAllCategories } from '@/hooks/useReactiveQuery';
import { ThemedView } from '@/components/ThemedView';
import ExpenseTabSelector from '@/components/ExpenseTabSelector';
import { FontAwesome6 } from '@expo/vector-icons';

const CategoryEdit = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const [curentTab, setCurrentTab] = useState('expense');

  const allCategories = useGetAllCategories();

  return (
    <YStack gap={20} padding={'$5'} f={1} pb={'$9'}>
      <XStack ai={'center'}>
        <Stack
          onPress={navigation.goBack}
          p={2}
          br={50}
          bg={'$gray10'}
          opacity={0.3}>
          <Entypo
            name="chevron-down"
            size={24}
            color={Colors[colorScheme].tint}
          />
        </Stack>
        <ThemedText type="defaultSemiBold">Categories</ThemedText>
      </XStack>
      <FlatList
        data={allCategories}
        renderItem={({ item }) => (
          <ThemedView
            p={2}
            br={'$2'}
            paddingVertical={'$2'}
            mb={'$2'}
            paddingHorizontal={'$4'}>
            <ThemedText>{item.name}</ThemedText>
          </ThemedView>
        )}
        keyExtractor={item => item.id}
      />
      <XStack ai={'center'} justifyContent="space-between">
        <ExpenseTabSelector
          curentTab={curentTab}
          setCurrentTab={setCurrentTab}
        />
        <Button
          themeInverse
          size={'$3'}
          iconAfter={() => (
            <FontAwesome6
              name="add"
              size={16}
              color={Colors[colorScheme].tint}
            />
          )}>
          New
        </Button>
      </XStack>
    </YStack>
  );
};

export default CategoryEdit;
