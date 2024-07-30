import React, { useRef } from 'react';
import { Button, Popover, XStack } from 'tamagui';
import { ThemedText } from './ThemedText';
import { Entypo } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { StyleSheet, useColorScheme } from 'react-native';

interface ICategotyProps {
  currentSelectedDuration: 'week' | 'month' | 'year';
  onSelect: (duration: 'week' | 'month' | 'year') => void;
}

const DURATIONS = ['week', 'month', 'year'];

export function TimeDurationSelector({
  currentSelectedDuration,
  onSelect,
}: PopoverProps & ICategotyProps) {
  const colorScheme = useColorScheme();
  const popoverRef = useRef<Popover>();
  return (
    <Popover ref={popoverRef} size="$3" allowFlip placement="bottom">
      <Popover.Trigger asChild>
        <Button
          themeInverse
          icon={() => (
            <Entypo
              name="select-arrows"
              size={18}
              color={Colors[colorScheme].tint}
            />
          )}>
          {currentSelectedDuration[0].toUpperCase() +
            currentSelectedDuration.slice(1)}
        </Button>
      </Popover.Trigger>
      <Popover.Content
        borderWidth={0}
        themeInverse
        mt={'$2'}
        p={'$2'}
        backgroundColor={Colors[colorScheme].background}
        br={10}
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
        {DURATIONS.map(item => (
          <XStack
            jc={'center'}
            backgroundColor={
              currentSelectedDuration === item
                ? 'rgba(155, 153, 150, 0.3)'
                : 'transparent'
            }
            key={item}
            w={'$9'}
            alignSelf="center"
            ai={'center'}
            mb={'$2'}
            br={10}
            pressStyle={{ opacity: 0.5 }}
            onPress={() => {
              popoverRef.current?.close();
              onSelect(item as 'week' | 'month' | 'year');
            }}
            paddingVertical={'$1.5'}>
            <ThemedText type="defaultSemiBold">
              {item[0].toUpperCase()}
              {item.slice(1)}
            </ThemedText>
          </XStack>
        ))}
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

export default TimeDurationSelector;
