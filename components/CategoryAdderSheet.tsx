import { StyleSheet, useColorScheme } from 'react-native';
import React, { useState } from 'react';
import { Button, Input, Sheet, Stack, XStack, YStack } from 'tamagui';
import { Colors } from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ExpenseTabSelector from './ExpenseTabSelector';
import { Entypo, FontAwesome6 } from '@expo/vector-icons';
import ColourSelectorPopover from './ColourSelectorPopover';
import { isEmoji } from '@/hooks/utils';
import { dbService } from '@/hooks/db-service';

const CategoryAdderSheet = ({ open, setOpen, navigation }) => {
  const { bottom } = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const [currentTab, setCurrentTab] = useState<'expense' | 'income'>('expense');
  const [categoryEmoji, setCategoryEmoji] = useState('');
  const [categoryName, setcategoryName] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [openColourSelector, setOpenColourSelector] = useState(false);

  const handleChangeText = text => {
    if (isEmoji(text) || text === '') {
      setCategoryEmoji(text);
    }
  };

  return (
    <>
      <Sheet
        forceRemoveScrollEnabled={open}
        modal={false}
        open={open}
        onOpenChange={setOpen}
        snapPointsMode={'fit'}
        moveOnKeyboardChange
        dismissOnSnapToBottom
        zIndex={100_000}
        animation="medium">
        <Sheet.Overlay
          animation="lazy"
          enterStyle={styles.opacity}
          exitStyle={styles.opacity}
        />
        <Sheet.Frame
          f={1}
          backgroundColor={Colors[colorScheme].background}
          padding="$4">
          <YStack
            ai={'center'}
            gap={'$3'}
            pb={bottom}
            pt={20}
            paddingHorizontal={'$4'}
            f={1}>
            <XStack>
              <Stack
                onPress={navigation.goBack}
                p={2}
                alignSelf="center"
                br={50}
                bg={'$gray10'}
                opacity={0.3}>
                <Entypo
                  name="chevron-down"
                  size={24}
                  color={Colors[colorScheme].tint}
                />
              </Stack>
              <ExpenseTabSelector setCurrentTab={setCurrentTab} />
            </XStack>
            <Input
              caretHidden
              value={categoryEmoji}
              onChangeText={handleChangeText}
              size={'$6'}
              w={'$7'}
              alignSelf="center"
              themeInverse
            />
            <XStack gap={'$3'}>
              <Stack
                onPress={() => setOpenColourSelector(true)}
                br={'$5'}
                bw={'$0.5'}
                p={'$2'}
                paddingHorizontal={'$5'}
                ai={'center'}
                jc={'center'}
                borderColor={'$borderColor'}
                opacity={selectedColor ? 1 : 0.1}
                backgroundColor={selectedColor}
              />
              <Input
                value={categoryName}
                onChangeText={setcategoryName}
                f={1}
                placeholder="Category Name"
                size={'$4.5'}
                alignSelf="center"
                themeInverse
              />
              <Button
                disabled={!categoryName || !selectedColor || !categoryEmoji}
                size={'$4.5'}
                onPress={() => {
                  dbService.addCategory({
                    color: selectedColor,
                    icon: categoryEmoji,
                    name: categoryName,
                    type: currentTab,
                  });
                  setOpen(false);
                }}
                iconAfter={() => (
                  <FontAwesome6
                    name="add"
                    size={20}
                    color={Colors[colorScheme].background}
                  />
                )}
              />
            </XStack>
          </YStack>
        </Sheet.Frame>
      </Sheet>
      <ColourSelectorPopover
        open={openColourSelector}
        setOpen={setOpenColourSelector}
        onSelect={setSelectedColor}
        selectedColor={selectedColor}
      />
    </>
  );
};

const styles = StyleSheet.create({
  dayText: { opacity: 0.5, fontWeight: '600' },
  opacity: { opacity: 0 },
});

export default CategoryAdderSheet;
