import { View, SectionList, StyleSheet } from 'react-native';
import React, { useMemo } from 'react';
import { ThemedText } from './ThemedText';
import { Separator, Stack, XStack, YStack } from 'tamagui';
import { sign } from '@/hooks/utils';
import dayjs from 'dayjs';

const CURRENCY = '₹';

const TransactionList = ({ hideHeader, allTransactions }) => {
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

  function label(date: Dayjs) {
    if (dayjs(date).isSame(dayjs(), 'day')) {
      return 'TODAY';
    }
    if (dayjs(date).isSame(dayjs().subtract(1, 'day'), 'day')) {
      return 'YESTERDAY';
    }
    return dayjs(date).format('ddd, D MMM').toLocaleUpperCase();
  }

  return (
    <SectionList
      ListHeaderComponent={() => {
        if (hideHeader) return null;
        return (
          <View style={styles.totalAmount}>
            <ThemedText type="defaultSemiBold" style={styles.totalAmountText}>
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
          </View>
        );
      }}
      showsVerticalScrollIndicator={false}
      stickySectionHeadersEnabled={false}
      renderSectionHeader={({ section: { date, total } }) => (
        <View style={styles.translucentTitle}>
          <View style={styles.transactionDate}>
            <ThemedText>{label(date)}</ThemedText>
            <ThemedText>
              {sign(total)}
              {CURRENCY} {Math.abs(total)?.toLocaleString()}
            </ThemedText>
          </View>
          <Separator borderWidth={1} mt={5} />
        </View>
      )}
      sections={allTransactions}
      renderItem={({ item }) => (
        <View style={styles.transactionContainer}>
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
              <ThemedText style={styles.title}>{item.category_name}</ThemedText>
              <ThemedText type="dim" style={styles.timestamp}>
                {dayjs.unix(item.date).format('H:MM A')}
              </ThemedText>
            </YStack>
          </XStack>
          <ThemedText style={styles.transaction}>
            {sign(item.amount)}
            {CURRENCY} {Math.abs(item.amount)?.toLocaleString()}
          </ThemedText>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  transaction: {
    fontWeight: '600',
    fontSize: 18,
    textAlignVertical: 'center',
  },
  title: { fontWeight: '600', fontSize: 16 },
  transactionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
  translucentTitle: { marginVertical: 10, opacity: 0.5 },
  transactionDate: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  creditText: { color: '#FDB645' },
  debitText: { color: '#DA1E28' },
  creditAndDebit: { flexDirection: 'row' },
  totalAmountText: {
    fontSize: 48,
  },
  totalAmount: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currency: {
    fontSize: 30,
    textAlignVertical: 'center',
    color: 'lightgray',
    opacity: 0.3,
  },
});

export default TransactionList;
