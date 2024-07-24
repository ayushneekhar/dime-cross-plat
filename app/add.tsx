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
import { storage } from '@/hooks/MMKV';
import { MMKVConstants } from '@/constants/MMKVConstants';
import { dbService } from '@/hooks/db-service';
import AnimatedButton from '@/components/AnimatedButton';
import { Input, XStack, YStack } from 'tamagui';
import CategoryPopover from '@/components/CategoryPopover';
import TimeSelectorPopover from '@/components/TimeSelectorPopover';
import * as Burnt from 'burnt';

const KEYBOARD = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'D'];

const ListHeader = ({
  selectedCategory,
  setSelectedCategory,
  setOpen,
  selectedTime,
  navigation,
  selectedDate,
}) => {
  const colorScheme = useColorScheme();

  const allCategories = dbService.getCategoriesByUser(
    storage.getString(MMKVConstants.USER_ID),
  );
  function date(dateString: string) {
    if (dayjs(dateString).isSame(dayjs(), 'day')) {
      return `Today, ${dayjs().format('D MMM')}`;
    } else return dayjs(dateString).format('ddd, D MMM');
  }

  return (
    <XStack mb={5} f={1}>
      <XStack
        onPress={() => setOpen(true)}
        ai={'center'}
        bc={'rgba(155, 153, 150, 0.3)'}
        bw={1}
        br={10}
        f={1}
        paddingHorizontal={10}
        mr={10}>
        <AntDesign
          name="calendar"
          size={20}
          color={Colors[colorScheme].tint}
          style={styles.listHeaderIcons}
        />
        <XStack f={1} jc={'space-between'}>
          <ThemedText type="defaultSemiBold">{date(selectedDate)}</ThemedText>
          <ThemedText type="defaultSemiBold">
            {dayjs(selectedTime.toUTCString()).format('HH:mm')}
          </ThemedText>
        </XStack>
      </XStack>
      <CategoryPopover
        navigation={navigation}
        placement="top"
        categories={allCategories}
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
        Name="category-popover"
        Icon={() => (
          <XStack
            ai={'center'}
            jc={'center'}
            backgroundColor={'$colorTransparent'}>
            {!selectedCategory && (
              <MaterialIcons
                name="category"
                size={20}
                color={Colors[colorScheme].tint}
                style={styles.listHeaderIcons}
              />
            )}
            <ThemedText type="defaultSemiBold">
              {selectedCategory?.icon ? selectedCategory.icon : ''}{' '}
              {selectedCategory?.name ? selectedCategory.name : 'Category'}
            </ThemedText>
          </XStack>
        )}
      />
    </XStack>
  );
};

const AddTransaction = () => {
  const [open, setOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState();
  const [description, setDescription] = React.useState('');
  const [selectedTime, setSelectedTime] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState(
    dayjs().format('YYYY-MM-DD'),
  );
  const [amount, setAmount] = React.useState(0);

  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();
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
      <XStack f={1} jc={'center'} ai={'center'}>
        <YStack ai={'center'} f={1}>
          <ThemedText type="title">{amount}</ThemedText>
          <XStack mt={10} ai={'center'} pr={20}>
            <MaterialIcons
              name="notes"
              size={20}
              style={styles.listHeaderIcons}
              color={Colors[colorScheme].tint}
            />
            <Input
              value={description}
              onChange={e =>
                setDescription(e.nativeEvent.text.replace(/\s+/g, ' '))
              }
              color={Colors[colorScheme].tint}
              behavior={'padding'}
              caretHidden
              size="$3"
              width={80}
              placeholder="Add Note"
              focusStyle={{
                borderColor: Colors[colorScheme].tint,
              }}
              backgroundColor={Colors[colorScheme].background}
              borderColor={'rgba(155, 153, 150, 0.3)'}
              borderWidth={1}
            />
          </XStack>
          <Pressable
            onPress={() => setAmount(0)}
            style={styles.backspaceIcon(Colors[colorScheme].tint)}>
            <MaterialCommunityIcons
              name="backspace"
              size={20}
              color={Colors[colorScheme].tint}
            />
          </Pressable>
        </YStack>
      </XStack>
      <View style={styles.keyboardContainer}>
        <FlatList
          ListHeaderComponent={() => (
            <ListHeader
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              setOpen={setOpen}
              setSelectedCategory={setSelectedCategory}
              selectedCategory={selectedCategory}
              navigation={navigation}
            />
          )}
          contentContainerStyle={styles.keyboardListContainer}
          scrollEnabled={false}
          data={KEYBOARD}
          numColumns={3}
          renderItem={({ item, index }) => (
            <AnimatedButton
              style={[
                styles.button(item === 'D', Colors[colorScheme].tint),
                index % 3 === 1 && styles.middleItem,
              ]}
              onPress={() => {
                if (item === 'D') {
                  if (!selectedCategory) {
                    Burnt.toast({
                      title: 'Incomplete Transaction',
                      message: '2000',
                      preset: 'done',
                      haptic: true,
                    });
                    return;
                  }
                  if (amount === 0) return;
                  dbService.addTransaction({
                    amount,
                    category_id: selectedCategory.id,
                    date: dayjs(selectedDate)
                      .set('hour', selectedTime.getHours())
                      .set('minute', selectedTime.getMinutes())
                      .unix(),
                    description,
                  });
                  navigation.goBack();
                } else {
                  setAmount(prev =>
                    prev === 0 ? item : Number(String(prev) + String(item)),
                  );
                }
              }}>
              {item === 'D' ? (
                <MaterialIcons
                  name="done"
                  size={24}
                  color={Colors[colorScheme].background}
                />
              ) : (
                <ThemedText style={styles.buttonText}>{item}</ThemedText>
              )}
            </AnimatedButton>
          )}
        />
      </View>
      <TimeSelectorPopover
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        open={open}
        setOpen={setOpen}
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
      />
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
  buttonText: { fontSize: 28, fontWeight: '600' },
  middleItem: { marginHorizontal: '3%' },
  rightHalf: {
    width: '32%',
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
