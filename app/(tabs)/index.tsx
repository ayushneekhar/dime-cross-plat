import { StyleSheet, View, useColorScheme } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Button } from 'tamagui';
import { dbService } from '@/hooks/db-service';
import { useGetAllTransactions } from '@/hooks/useReactiveQuery';
import TransactionList from '@/components/TransactionList';

export default function HomeScreen() {
  const { top } = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const allTransactions = useGetAllTransactions();

  return (
    <View style={styles.screen(top)}>
      <View style={styles.headerContainer}>
        <AntDesign name="search1" size={24} color={Colors[colorScheme].tint} />
        <Button onPress={() => dbService.dropTables()}>Drop Tables</Button>
        <Ionicons name="filter" size={24} color={Colors[colorScheme].tint} />
      </View>
      <View style={styles.titleContainer}>
        <TransactionList allTransactions={allTransactions} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  timestamp: { fontWeight: '300', fontSize: 14 },
  daySeperator: {
    height: 3,
    backgroundColor: 'lightgray',
    borderRadius: 10,
    opacity: 0.3,
    marginTop: 5,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignSelf: 'center',
    paddingVertical: 10,
  },
  screen: inset => ({
    flex: 1,
    paddingTop: inset,
  }),
  titleContainer: {
    paddingHorizontal: 25,
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
});
