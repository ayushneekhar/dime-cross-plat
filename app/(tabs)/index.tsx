import { StyleSheet, SectionList, View, useColorScheme } from 'react-native';
import React from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import dayjs, { Dayjs } from 'dayjs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Separator, Stack, XStack, YStack } from 'tamagui';
import { dbService } from '@/hooks/db-service';

const MOCK_DATA = [
  {
    title: dayjs(),
    total: 20,
    data: [
      {
        timestamp: dayjs(),
        icon: '',
        title: "Filet O' Fish",
        isRepeat: true,
        amount: 20,
      },
      {
        timestamp: dayjs(),
        icon: '',
        title: 'Rent',
        isRepeat: true,
        amount: 20,
      },
    ],
  },
  {
    title: dayjs().subtract(1, 'day'),
    total: 20,
    data: [
      {
        timestamp: dayjs().subtract(1, 'day'),
        icon: '',
        title: 'Netflix',
        isRepeat: true,
        amount: 20,
      },
      {
        timestamp: dayjs().subtract(1, 'day'),
        icon: '',
        title: 'Jio Cinema',
        isRepeat: true,
        amount: 20,
      },
    ],
  },
  {
    title: dayjs().subtract(2, 'day'),
    total: 20,
    data: [
      {
        timestamp: dayjs().subtract(2, 'day'),
        icon: '',
        title: 'Snaks',
        isRepeat: true,
        amount: 20,
      },
      {
        timestamp: dayjs().subtract(2, 'day'),
        icon: '',
        title: 'Dinner',
        isRepeat: true,
        amount: 20,
      },
    ],
  },
  {
    title: dayjs().subtract(3, 'day'),
    total: 20,
    data: [
      {
        timestamp: dayjs().subtract(3, 'day'),
        icon: '',
        title: 'Dinner',
        isRepeat: true,
        amount: 20,
      },
      {
        timestamp: dayjs().subtract(3, 'day'),
        icon: '',
        title: 'Lunch',
        isRepeat: true,
        amount: 20,
      },
    ],
  },
  {
    title: dayjs().subtract(4, 'day'),
    total: 20,
    data: [
      {
        timestamp: dayjs().subtract(4, 'day'),
        icon: '',
        title: 'Breakfast',
        isRepeat: true,
        amount: 20,
      },
      {
        timestamp: dayjs().subtract(4, 'day'),
        icon: '',
        title: 'Fasion - Korean Pants',
        isRepeat: true,
        amount: 20,
      },
    ],
  },
  {
    title: dayjs().subtract(5, 'day'),
    total: 20,
    data: [
      {
        timestamp: dayjs().subtract(5, 'day'),
        icon: '',
        title: 'Bike Wash',
        isRepeat: true,
        amount: 20,
      },
      {
        timestamp: dayjs().subtract(5, 'day'),
        icon: '',
        title: 'Bike Service',
        isRepeat: true,
        amount: 20,
      },
    ],
  },
  {
    title: dayjs().subtract(6, 'day'),
    total: 20,
    data: [
      {
        timestamp: dayjs().subtract(6, 'day'),
        icon: '',
        title: 'Spotify',
        isRepeat: true,
        amount: 20,
      },
      {
        timestamp: dayjs().subtract(6, 'day'),
        icon: '',
        title: 'Dustbin',
        isRepeat: true,
        amount: 20,
      },
    ],
  },
  {
    title: dayjs().subtract(7, 'day'),
    total: 20,
    data: [
      {
        timestamp: dayjs().subtract(7, 'day'),
        icon: '',
        title: 'Bonus',
        isRepeat: true,
        amount: 20,
      },
      {
        timestamp: dayjs().subtract(7, 'day'),
        icon: '',
        title: 'Salary',
        isRepeat: true,
        amount: 20,
      },
    ],
  },
];
const CURRENCY = '₹';
const TOTAL = 20_534.0;
const TOTAL_INCOME = 64_945.0;
const TOTAL_EXPENSE = 44_872.0;

export default function HomeScreen() {
  const { top } = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const allTransactions = dbService.getAllTransactions();

  function label(date: Dayjs) {
    if (dayjs(date).isSame(dayjs(), 'day')) {
      return 'TODAY';
    }
    if (dayjs(date).isSame(dayjs().subtract(1, 'day'), 'day')) {
      return 'YESTERDAY';
    }
    return dayjs(date).format('ddd, D MMM').toLocaleUpperCase();
  }

  function sign(value: number) {
    return value > 0 ? '+' : '-';
  }
  return (
    <View style={styles.screen(Colors[colorScheme].background, top)}>
      <View style={styles.headerContainer}>
        <AntDesign name="search1" size={24} color={Colors[colorScheme].tint} />
        <Ionicons name="filter" size={24} color={Colors[colorScheme].tint} />
      </View>

      <ThemedView style={styles.titleContainer}>
        <SectionList
          bounces={false}
          ListHeaderComponent={() => {
            return (
              <ThemedView style={styles.totalAmount}>
                <ThemedText
                  type="defaultSemiBold"
                  style={styles.totalAmountText}>
                  <ThemedText style={styles.currency}>
                    {sign(TOTAL)} {CURRENCY}
                  </ThemedText>
                  {TOTAL.toLocaleString()}
                </ThemedText>
                <View style={styles.creditAndDebit}>
                  <ThemedText style={styles.creditText}>
                    +{TOTAL_INCOME.toLocaleString()}
                  </ThemedText>
                  <Separator vertical marginHorizontal={10} />
                  <ThemedText style={styles.debitText}>
                    -{TOTAL_EXPENSE.toLocaleString()}
                  </ThemedText>
                </View>
              </ThemedView>
            );
          }}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
          contentContainerStyle={styles.transactionListContainer}
          renderSectionHeader={({ section: { date, total } }) => (
            <View style={styles.translucentTitle}>
              <ThemedView style={styles.transactionDate}>
                <ThemedText>{label(date)}</ThemedText>
                <ThemedText>
                  {sign(total)}
                  {CURRENCY} {total}
                </ThemedText>
              </ThemedView>
              <Separator borderWidth={1} mt={5} />
            </View>
          )}
          sections={allTransactions}
          renderItem={({ item }) => (
            <ThemedView style={styles.transactionContainer}>
              <XStack gap={15}>
                <Stack
                  backgroundColor={item.category_color}
                  padding={10}
                  jc={'center'}
                  ai={'center'}
                  borderRadius={10}>
                  <ThemedText>{item.category_icon}</ThemedText>
                </Stack>
                <YStack gap={5}>
                  <ThemedText style={styles.title}>
                    {item.category_name}
                  </ThemedText>
                  <ThemedText type="dim" style={styles.timestamp}>
                    {dayjs.unix(item.date).format('H:MM A')}
                  </ThemedText>
                </YStack>
              </XStack>
              <ThemedText style={styles.transaction}>
                {sign(item.amount)}
                {CURRENCY} {item.amount}
              </ThemedText>
            </ThemedView>
          )}
        />
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  creditText: { color: '#FDB645' },
  debitText: { color: '#DA1E28' },
  title: { fontWeight: '600', fontSize: 16 },
  timestamp: { fontWeight: '300', fontSize: 14 },
  translucentTitle: { marginVertical: 10, opacity: 0.5 },
  transactionListContainer: {
    paddingHorizontal: 16,
  },
  transactionDate: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  daySeperator: {
    height: 3,
    backgroundColor: 'lightgray',
    borderRadius: 10,
    opacity: 0.3,
    marginTop: 5,
  },
  transactionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
  transaction: {
    fontWeight: '600',
    fontSize: 18,
    textAlignVertical: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignSelf: 'center',
    paddingVertical: 10,
  },
  screen: (color, inset) => ({
    backgroundColor: color,
    flex: 1,
    paddingTop: inset,
  }),
  totalAmountText: {
    fontSize: 48,
  },
  totalAmount: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  currency: {
    fontSize: 30,
    textAlignVertical: 'center',
    color: 'lightgray',
    opacity: 0.3,
  },
  creditAndDebit: { flexDirection: 'row' },
});
