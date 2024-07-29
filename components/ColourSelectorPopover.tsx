import React, { useRef } from 'react';
import { Button, Popover, Sheet } from 'tamagui';
import { StyleSheet, useColorScheme } from 'react-native';
import { Category } from '@/hooks/types';
import { FlatList } from 'react-native-gesture-handler';
import { Colors } from '@/constants/Colors';

interface ICategotyProps {
  selectedColor: string;
  onSelect: (color: string) => void;
}

const COLOUR_LIST = [
  '#FF0000',
  '#FF7F00',
  '#FFFF00',
  '#00FF00',
  '#00FFFF',
  '#0000FF',
  '#8B00FF',
  '#FF00FF',
  '#FF007F',
  '#FF0000',
  '#FF7F7F',
  '#FFFF7F',
  '#7FFF7F',
  '#7FFFFF',
  '#7F7FFF',
  '#B57FFF',
  '#FF7FFF',
  '#FF7FB5',
  '#FF7F7F',
  '#B57F7F',
];

export function ColourSelectorPopover({
  onSelect,
  open,
  setOpen,
}: PopoverProps & ICategotyProps) {
  const colorScheme = useColorScheme();
  const popoverRef = useRef<Sheet>();

  return (
    <Sheet
      ref={popoverRef}
      forceRemoveScrollEnabled={open}
      modal={false}
      open={open}
      onOpenChange={setOpen}
      snapPointsMode={'fit'}
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
        pb={'$6'}
        bw={1}
        borderBottomWidth={0}
        borderColor={'rgba(155, 153, 150, 0.3)'}
        jc={'center'}
        ai={'center'}
        backgroundColor={Colors[colorScheme].background}
        padding="$4">
        <FlatList
          data={COLOUR_LIST}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <Button
              onPress={() => {
                onSelect(item);
                setOpen(false);
              }}
              backgroundColor={item}
              height={40}
              width={40}
              borderRadius={20}
              margin={5}
            />
          )}
          numColumns={5}
          style={styles.listHeight}
        />
      </Sheet.Frame>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  listHeight: { maxHeight: 150 },
  editIcon: { marginRight: 10 },
  enterStyle: { y: -10, opacity: 0 },
  exitStyle: { y: -10, opacity: 0 },
});

export default ColourSelectorPopover;
