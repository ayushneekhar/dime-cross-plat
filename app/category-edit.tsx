import { useColorScheme, FlatList, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Button, Stack, XStack, YStack } from 'tamagui';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { ThemedText } from '@/components/ThemedText';
import { useNavigation } from 'expo-router';
import { useGetAllCategories } from '@/hooks/useReactiveQuery';
import ExpenseTabSelector from '@/components/ExpenseTabSelector';
import { FontAwesome6 } from '@expo/vector-icons';
import CategoryAdderSheet from '@/components/CategoryAdderSheet';
import { dbService } from '@/hooks/db-service';

const CategoryEdit = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const [curentTab, setCurrentTab] = useState('expense');
  const [open, setOpen] = useState(false);

  const allCategories = useGetAllCategories({ type: curentTab });

  return (
    <>
      <YStack gap={20} padding={'$5'} f={1} pb={'$9'}>
        <XStack ai={'center'} jc={'space-between'}>
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
          <Stack />
        </XStack>
        <FlatList
          bounces={false}
          data={allCategories}
          renderItem={({ item }) => (
            <XStack
              backgroundColor={Colors[colorScheme].background}
              br={'$2'}
              paddingVertical={'$3'}
              mb={'$2'}
              jc={'space-between'}
              ai={'center'}
              paddingHorizontal={'$4'}>
              <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
              <TouchableOpacity
                onPress={() => dbService.deleteCategory(item.id)}>
                <MaterialIcons
                  name="delete"
                  size={24}
                  color={Colors[colorScheme].tint}
                />
              </TouchableOpacity>
            </XStack>
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
            onPress={() => setOpen(true)}
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
      <CategoryAdderSheet
        navigation={navigation}
        open={open}
        setOpen={setOpen}
      />
    </>
  );
};

export default CategoryEdit;
