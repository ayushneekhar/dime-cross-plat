import { StyleSheet, useColorScheme } from 'react-native';
import React from 'react';
import { Sheet, XStack, YStack } from 'tamagui';
import { Entypo } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import {
  Calendar,
  CalendarTheme,
  useCalendar,
} from '@marceloterreiro/flash-calendar';
import dayjs from 'dayjs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from './ThemedText';
import DateTimePicker from '@react-native-community/datetimepicker';

const DAY_NAME = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const CategoryAdderSheet = ({
  open,
  setOpen,
  selectedTime,
  setSelectedTime,
  selectedDate,
  setSelectedDate,
}) => {
  const { bottom } = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const { weekDaysList, weeksList } = useCalendar({
    calendarMaxDateId: dayjs().format('YYYY-MM-DD'),
    calendarMonthId: dayjs(selectedDate).format('YYYY-MM-DD'),
    calendarActiveDateRanges: [
      {
        endId: selectedDate,
        startId: selectedDate,
      },
    ],
  });

  const calendarTheme: CalendarTheme = {
    rowMonth: {
      container: {
        backgroundColor: Colors[colorScheme].background,
        height: 40,
      },
      content: {
        color: Colors[colorScheme].text,
        fontSize: 17,
        width: 200,
        textAlign: 'center',
      },
    },
    itemWeekName: { content: { color: Colors[colorScheme].tint } },
    itemDay: {
      base: () => ({
        container: {
          padding: 0,
          borderRadius: 10,
        },
      }),
      today: () => ({
        container: {
          borderWidth: 2,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
          borderColor: 'rgba(155, 153, 150, 0.5)',
        },
      }),
      idle: ({ isDifferentMonth }) => ({
        content: isDifferentMonth
          ? {
              color: 'rgba(155, 153, 150, 0.5)',
            }
          : undefined,
      }),
      active: () => ({
        container: {
          backgroundColor: Colors[colorScheme].tint,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
        },
        content: {
          color: Colors[colorScheme].background,
        },
      }),
    },
  };

  return (
    <Sheet
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
        backgroundColor={Colors[colorScheme].background}
        padding="$4"
        justifyContent="center"
        alignItems="center"
        space="$5">
        <YStack pb={bottom} pt={20} paddingHorizontal={20}>
          <Calendar.VStack
            spacing={10}
            alignItems="center"
            justifyContent="center"
            grow>
            <Calendar.HStack>
              <XStack ai={'center'} jc={'space-between'} w={'100%'}>
                <XStack>
                  <ThemedText type="defaultSemiBold">
                    {dayjs(selectedDate).format('MMMM YYYY')}
                  </ThemedText>
                  <Entypo
                    name="chevron-right"
                    size={18}
                    color={Colors[colorScheme].tint}
                  />
                </XStack>
                <XStack gap={20} ai={'center'}>
                  <Entypo
                    onPress={() =>
                      setSelectedDate(dayjs(selectedDate).subtract(1, 'month'))
                    }
                    name="chevron-left"
                    size={22}
                    color={Colors[colorScheme].tint}
                  />
                  <Entypo
                    onPress={() =>
                      setSelectedDate(dayjs(selectedDate).add(1, 'month'))
                    }
                    name="chevron-right"
                    size={22}
                    color={Colors[colorScheme].tint}
                  />
                </XStack>
              </XStack>
            </Calendar.HStack>
            <Calendar.Row.Week spacing={3}>
              {weekDaysList.map((day, i) => (
                <ThemedText style={styles.dayText} key={`${day}-${i}`}>
                  {DAY_NAME[i]}
                </ThemedText>
              ))}
            </Calendar.Row.Week>
            {weeksList.map((week, i) => (
              <Calendar.Row.Week key={`${week}-${i}`}>
                {week.map(day => (
                  <Calendar.Item.Day.Container
                    dayHeight={40}
                    isStartOfWeek={day.isStartOfWeek}
                    key={day.id}>
                    <Calendar.Item.Day
                      theme={calendarTheme.itemDay}
                      height={40}
                      metadata={day}
                      onPress={setSelectedDate}>
                      {day.displayLabel}
                    </Calendar.Item.Day>
                  </Calendar.Item.Day.Container>
                ))}
              </Calendar.Row.Week>
            ))}
          </Calendar.VStack>

          <XStack ai={'center'} jc={'space-between'} mt={20}>
            <ThemedText type="defaultSemiBold">Time</ThemedText>
            <DateTimePicker
              testID="dateTimePicker"
              value={selectedTime}
              mode={'time'}
              is24Hour
              onChange={(_, time) => {
                setSelectedTime(time);
              }}
            />
          </XStack>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
};

const styles = StyleSheet.create({
  dayText: { opacity: 0.5, fontWeight: '600' },
  opacity: { opacity: 0 },
});

export default CategoryAdderSheet;
