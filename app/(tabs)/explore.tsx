import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Stack } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabTwoScreen() {
  const { top } = useSafeAreaInsets();
  return (
    <Stack pt={top} paddingHorizontal={'$5'}>
      <ThemedText>Insights</ThemedText>
    </Stack>
  );
}

const styles = StyleSheet.create({});
