import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Stack, XStack } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import TimeDurationSelector from '@/components/TimeDurationSelector';
import { useGetTransactionsByTimeDuration } from '@/hooks/useReactiveQuery';
import TransactionList from '@/components/TransactionList';

export default function TabTwoScreen() {
  const { top } = useSafeAreaInsets();
  const [currentTimeDuration, setCurrentTimeDuration] = useState<
    'week' | 'month' | 'year'
  >('week');

  const allTransactions = useGetTransactionsByTimeDuration({
    duration: currentTimeDuration,
  });

  return (
    <Stack pt={top} paddingHorizontal={'$5'}>
      <XStack jc={'space-between'}>
        <ThemedText type="title">Insights</ThemedText>
        <TimeDurationSelector
          currentSelectedDuration={currentTimeDuration}
          onSelect={duration => setCurrentTimeDuration(duration)}
        />
      </XStack>
      <TransactionList allTransactions={allTransactions} hideHeader />
    </Stack>
  );
}

const styles = StyleSheet.create({});
