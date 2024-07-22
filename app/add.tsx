import {
  View,
  FlatList,
  Pressable,
  useColorScheme,
  StyleSheet,
} from 'react-native';
import React from 'react';
import { ThemedText } from '@/components/ThemedText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import dayjs from 'dayjs';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { hexToRgba } from '@/hooks/utils';
import { ThemedView } from '@/components/ThemedView';
import { storage } from '@/hooks/MMKV';
import { MMKVConstants } from '@/constants/MMKVConstants';

const KEYBOARD = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'D'];

const ListHeader = () => {
  const colorScheme = useColorScheme();
  function date(dateString: string) {
    if (dayjs(dateString).isSame(dayjs(), 'day')) {
      return `Today, ${dayjs().format('D MMM')}`;
    } else return dayjs(dateString).format('ddd, D MMM');
  }

  return (
    <View style={styles.listHeaderContainer}>
      <Pressable style={[styles.timeStampSections, styles.leftHalf]}>
        <AntDesign
          name="calendar"
          size={24}
          color={Colors[colorScheme].tint}
          style={styles.listHeaderIcons}
        />
        <View style={styles.dateTimeContainer}>
          <ThemedText>{date(dayjs().format())}</ThemedText>
          <ThemedText>{dayjs().format('HH:MM')}</ThemedText>
        </View>
      </Pressable>
      <Pressable style={[styles.timeStampSections, styles.rightHalf]}>
        <MaterialIcons
          name="category"
          size={24}
          color={Colors[colorScheme].tint}
          style={styles.listHeaderIcons}
        />
        <ThemedText>Category</ThemedText>
      </Pressable>
    </View>
  );
};

const AddTransaction = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = React.useState('');
  const { top } = useSafeAreaInsets();
  const [amount, setAmount] = React.useState(0);
  const colorScheme = useColorScheme();

  return (
    <View style={[styles.screen(top)]}>
      <View style={styles.header}>
        <Pressable
          style={[styles.close, styles.repeat(Colors[colorScheme].tint)]}
          onPress={navigation.goBack}>
          <AntDesign
            name="close"
            size={18}
            color={Colors[colorScheme].tint}
            style={styles.closeIcon}
          />
        </Pressable>
        <Pressable style={styles.repeat(Colors[colorScheme].tint)}>
          <Feather name="repeat" size={18} color={Colors[colorScheme].tint} />
        </Pressable>
      </View>
      <View style={styles.totalAmount}>
        <ThemedText type="title">{amount}</ThemedText>
        <Pressable
          onPress={() => setAmount(0)}
          style={styles.backspaceIcon(Colors[colorScheme].tint)}>
          <MaterialCommunityIcons
            name="backspace"
            size={20}
            color={Colors[colorScheme].tint}
          />
        </Pressable>
      </View>
      <View style={styles.keyboardContainer}>
        <FlatList
          ListHeaderComponent={ListHeader}
          contentContainerStyle={styles.keyboardListContainer}
          scrollEnabled={false}
          data={KEYBOARD}
          numColumns={3}
          renderItem={({ item, index }) => {
            return (
              <Pressable
                onPress={() => {
                  if (item === 'D') {
                    storage.set(MMKVConstants.TRANSACTIONS, [
                      ...storage.get(MMKVConstants.TRANSACTIONS),
                      {
                        amount,
                        category: selectedCategory,
                        date: dayjs().format(),
                      },
                    ]);
                    setAmount(0);
                  } else {
                    setAmount(prev =>
                      prev === 0 ? item : Number(String(prev) + String(item)),
                    );
                  }
                }}
                style={[
                  styles.button(item === 'D', Colors[colorScheme].tint),
                  index % 3 === 1 && styles.middleItem,
                ]}>
                {item === 'D' ? (
                  <MaterialIcons
                    name="done"
                    size={24}
                    color={Colors[colorScheme].background}
                  />
                ) : (
                  <ThemedText style={styles.buttonText}>{item}</ThemedText>
                )}
              </Pressable>
            );
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: (isDone, doneColor) => ({
    marginVertical: 5,
    borderRadius: 10,
    padding: 20,
    backgroundColor: isDone ? doneColor : 'rgba(155, 153, 150, 0.3)',
    width: '31%',
    justifyContent: 'center',
    alignItems: 'center',
  }),
  buttonText: { fontSize: 28 },
  timeStampSections: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(155, 153, 150, 0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  middleItem: { marginHorizontal: '3%' },
  leftHalf: {
    width: '65%',
  },
  rightHalf: {
    width: '32%',
  },
  listHeaderContainer: {
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listHeaderIcons: { opacity: 0.3, marginRight: 10 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 10,
  },
  screen: top => ({ flex: 1, marginTop: top }),
  repeat: color => ({
    height: 34,
    width: 34,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    backgroundColor: `#${hexToRgba(color, 0.2)}`,
  }),
  close: {
    marginLeft: 10,
  },
  totalAmount: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  keyboardContainer: { height: '50%' },
  keyboardListContainer: {
    paddingHorizontal: 10,
  },
  backspaceIcon: color => ({
    position: 'absolute',
    right: 10,
    backgroundColor: `#${hexToRgba(color, 0.2)}`,
    borderRadius: 100,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  }),
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
});

export default AddTransaction;
