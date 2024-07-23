import { View, Text, useColorScheme } from 'react-native';
import React, { useState } from 'react';
import { Button, H2, Input, Paragraph, Sheet, YStack } from 'tamagui';
import { Entypo } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

const TimeSelectorPopover = ({ open, setOpen, ...props }) => {
  const [position, setPosition] = useState(0);
  const colorScheme = useColorScheme();

  return (
    <Sheet
      forceRemoveScrollEnabled={open}
      modal={false}
      open={open}
      onOpenChange={setOpen}
      snapPointsMode={'fit'}
      dismissOnSnapToBottom
      position={position}
      onPositionChange={setPosition}
      zIndex={100_000}
      animation="medium">
      <Sheet.Overlay
        animation="lazy"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Handle />
      <Sheet.Frame
        padding="$4"
        justifyContent="center"
        alignItems="center"
        space="$5">
        <Button
          size="$6"
          circular
          icon={() => (
            <Entypo
              name="chevron-down"
              size={24}
              color={Colors[colorScheme].tint}
            />
          )}
          onPress={() => setOpen(false)}
        />
        <Input width={200} />

        <>
          <Sheet
            animation="medium"
            modal
            snapPoints={[90]}
            dismissOnSnapToBottom
            {...props}>
            <Sheet.Overlay
              animation="medium"
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
            />
            <Sheet.Handle />
            <Sheet.Frame
              flex={1}
              justifyContent="center"
              alignItems="center"
              space="$5">
              <Sheet.ScrollView>
                <YStack p="$5" gap="$8">
                  <Button
                    size="$6"
                    circular
                    alignSelf="center"
                    icon={() => (
                      <Entypo
                        name="chevron-down"
                        size={24}
                        color={Colors[colorScheme].tint}
                      />
                    )}
                    onPress={() => props.onOpenChange?.(false)}
                  />
                  <H2>Hello world</H2>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                    <Paragraph key={i} size="$8">
                      Eu officia sunt ipsum nisi dolore labore est laborum
                      laborum in esse ad pariatur. Dolor excepteur esse deserunt
                      voluptate labore ea. Exercitation ipsum deserunt occaecat
                      cupidatat consequat est adipisicing velit cupidatat
                      ullamco veniam aliquip reprehenderit officia. Officia
                      labore culpa ullamco velit. In sit occaecat velit ipsum
                      fugiat esse aliqua dolor sint.
                    </Paragraph>
                  ))}
                </YStack>
              </Sheet.ScrollView>
            </Sheet.Frame>
          </Sheet>
          <Button
            size="$6"
            circular
            icon={() => (
              <Entypo
                name="chevron-up"
                size={24}
                color={Colors[colorScheme].tint}
              />
            )}
            onPress={() => setInnerOpen(true)}
          />
        </>
      </Sheet.Frame>
    </Sheet>
  );
};

export default TimeSelectorPopover;
