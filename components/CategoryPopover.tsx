import React, { useRef } from 'react';
import { Button, Popover, XStack } from 'tamagui';
import { ThemedText } from './ThemedText';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { StyleSheet, useColorScheme } from 'react-native';
import { hexToRgba } from '@/hooks/utils';
import { Category } from '@/hooks/types';

interface ICategotyProps {
  Icon: any;
  categories: Category[];
  selectedCategory: Category;
  onSelect: (category: Category) => void;
}

export function CategoryPopover({
  Icon,
  categories,
  selectedCategory,
  onSelect,
  navigation,
}: PopoverProps & ICategotyProps) {
  const colorScheme = useColorScheme();
  const popoverRef = useRef<Popover>();
  return (
    <Popover ref={popoverRef} size="$3" allowFlip placement="top">
      <Popover.Trigger asChild>
        <Button
          backgroundColor={
            selectedCategory?.color
              ? hexToRgba(selectedCategory.color, 0.4)
              : '$colorTransparent'
          }
          borderColor={
            selectedCategory?.color
              ? hexToRgba(selectedCategory.color, 0.4)
              : 'rgba(155, 153, 150, 0.3)'
          }
          icon={Icon}
        />
      </Popover.Trigger>
      <Popover.Content
        borderWidth={0}
        mb={-10}
        backgroundColor={'$colorTransparent'}
        enterStyle={styles.enterStyle}
        exitStyle={styles.exitStyle}
        animation={[
          'quick',
          {
            opacity: {
              overshootClamping: true,
            },
          },
        ]}>
        <XStack
          bw={1}
          borderColor={'rgba(155, 153, 150, 0.3)'}
          paddingHorizontal={10}
          alignSelf="center"
          ai={'center'}
          mb={10}
          onPress={() => {
            popoverRef.current?.close();
            navigation.navigate('category-edit');
          }}
          paddingVertical={10}
          br={10}>
          <Feather
            style={styles.editIcon}
            name="edit-2"
            size={16}
            color={Colors[colorScheme].tint}
          />
          <ThemedText>Edit</ThemedText>
        </XStack>
        <Popover.ScrollView
          style={styles.listHeight}
          showsVerticalScrollIndicator={false}>
          {categories.map(({ name, id, icon }, index) => (
            <XStack
              mb={10}
              key={id}
              onPress={() => onSelect(categories[index])}
              bw={1}
              borderColor={'rgba(155, 153, 150, 0.3)'}
              paddingHorizontal={10}
              alignSelf="center"
              paddingVertical={10}
              br={10}>
              <ThemedText>
                {icon} {name}
              </ThemedText>
            </XStack>
          ))}
        </Popover.ScrollView>
      </Popover.Content>
    </Popover>
  );
}

const styles = StyleSheet.create({
  listHeight: { maxHeight: 150 },
  editIcon: { marginRight: 10 },
  enterStyle: { y: -10, opacity: 0 },
  exitStyle: { y: -10, opacity: 0 },
});

export default CategoryPopover;
