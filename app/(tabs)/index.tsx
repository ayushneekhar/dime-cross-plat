import { StyleSheet, SectionList, View, useColorScheme } from 'react-native';
import React, { useMemo } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import dayjs, { Dayjs } from 'dayjs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Button, Separator, Stack, XStack, YStack } from 'tamagui';
import { dbService } from '@/hooks/db-service';
import { useGetAllTransactions } from '@/hooks/useReactiveQuery';
import { sign } from '@/hooks/utils';

const CURRENCY = '₹';

export default function HomeScreen() {
  const { top } = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const allTransactions = useGetAllTransactions();

  function label(date: Dayjs) {
    if (dayjs(date).isSame(dayjs(), 'day')) {
      return 'TODAY';
    }
    if (dayjs(date).isSame(dayjs().subtract(1, 'day'), 'day')) {
      return 'YESTERDAY';
    }
    return dayjs(date).format('ddd, D MMM').toLocaleUpperCase();
  }

  const { totalAmount, totalIncome, totalExpense } = useMemo(
    () =>
      allTransactions.reduce(
        (acc, { data }) => {
          const tmpTotalAmount = data.reduce(
            (accTo, { amount }) => accTo + amount,
            0,
          );
          const tmpTotalIncome = data
            .filter(({ amount }) => amount > 0)
            .reduce((accIn, { amount }) => accIn + amount, 0);
          const tmpTotalExpense = data
            .filter(({ amount }) => amount < 0)
            .reduce((accEx, { amount }) => accEx + amount, 0);
          return {
            totalAmount: acc.totalAmount + tmpTotalAmount,
            totalIncome: acc.totalIncome + tmpTotalIncome,
            totalExpense: acc.totalExpense + tmpTotalExpense,
          };
        },
        { totalAmount: 0, totalIncome: 0, totalExpense: 0 },
      ),
    [allTransactions],
  );

  return (
    <View style={styles.screen(Colors[colorScheme].background, top)}>
      <View style={styles.headerContainer}>
        <AntDesign name="search1" size={24} color={Colors[colorScheme].tint} />
        <Button onPress={() => dbService.dropTables()}>Drop Tables</Button>
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
                    {sign(totalAmount)} {CURRENCY}
                  </ThemedText>
                  {Math.abs(totalAmount).toLocaleString()}
                </ThemedText>
                <View style={styles.creditAndDebit}>
                  <ThemedText style={styles.creditText}>
                    +{totalIncome.toLocaleString()}
                  </ThemedText>
                  <Separator vertical marginHorizontal={10} />
                  <ThemedText style={styles.debitText}>
                    {totalExpense.toLocaleString()}
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
                  {CURRENCY} {Math.abs(total)?.toLocaleString()}
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
                {CURRENCY} {Math.abs(item.amount)?.toLocaleString()}
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
