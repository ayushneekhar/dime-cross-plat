import {
  Image,
  StyleSheet,
  Platform,
  Text,
  SectionList,
  View,
  useColorScheme,
} from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import dayjs, { Dayjs } from "dayjs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

const MOCK_DATA = [
  {
    title: dayjs(),
    total: 20,
    data: [
      {
        timestamp: dayjs(),
        icon: "",
        title: "Filet O' Fish",
        isRepeat: true,
        amount: 20,
      },
      {
        timestamp: dayjs(),
        icon: "",
        title: "Rent",
        isRepeat: true,
        amount: 20,
      },
    ],
  },
  {
    title: dayjs().subtract(1, "day"),
    total: 20,
    data: [
      {
        timestamp: dayjs().subtract(1, "day"),
        icon: "",
        title: "Netflix",
        isRepeat: true,
        amount: 20,
      },
      {
        timestamp: dayjs().subtract(1, "day"),
        icon: "",
        title: "Jio Cinema",
        isRepeat: true,
        amount: 20,
      },
    ],
  },
  {
    title: dayjs().subtract(2, "day"),
    total: 20,
    data: [
      {
        timestamp: dayjs().subtract(2, "day"),
        icon: "",
        title: "Snaks",
        isRepeat: true,
        amount: 20,
      },
      {
        timestamp: dayjs().subtract(2, "day"),
        icon: "",
        title: "Dinner",
        isRepeat: true,
        amount: 20,
      },
    ],
  },
  {
    title: dayjs().subtract(3, "day"),
    total: 20,
    data: [
      {
        timestamp: dayjs().subtract(3, "day"),
        icon: "",
        title: "Dinner",
        isRepeat: true,
        amount: 20,
      },
      {
        timestamp: dayjs().subtract(3, "day"),
        icon: "",
        title: "Lunch",
        isRepeat: true,
        amount: 20,
      },
    ],
  },
  {
    title: dayjs().subtract(4, "day"),
    total: 20,
    data: [
      {
        timestamp: dayjs().subtract(4, "day"),
        icon: "",
        title: "Breakfast",
        isRepeat: true,
        amount: 20,
      },
      {
        timestamp: dayjs().subtract(4, "day"),
        icon: "",
        title: "Fasion - Korean Pants",
        isRepeat: true,
        amount: 20,
      },
    ],
  },
  {
    title: dayjs().subtract(5, "day"),
    total: 20,
    data: [
      {
        timestamp: dayjs().subtract(5, "day"),
        icon: "",
        title: "Bike Wash",
        isRepeat: true,
        amount: 20,
      },
      {
        timestamp: dayjs().subtract(5, "day"),
        icon: "",
        title: "Bike Service",
        isRepeat: true,
        amount: 20,
      },
    ],
  },
  {
    title: dayjs().subtract(6, "day"),
    total: 20,
    data: [
      {
        timestamp: dayjs().subtract(6, "day"),
        icon: "",
        title: "Spotify",
        isRepeat: true,
        amount: 20,
      },
      {
        timestamp: dayjs().subtract(6, "day"),
        icon: "",
        title: "Dustbin",
        isRepeat: true,
        amount: 20,
      },
    ],
  },
  {
    title: dayjs().subtract(7, "day"),
    total: 20,
    data: [
      {
        timestamp: dayjs().subtract(7, "day"),
        icon: "",
        title: "Bonus",
        isRepeat: true,
        amount: 20,
      },
      {
        timestamp: dayjs().subtract(7, "day"),
        icon: "",
        title: "Salary",
        isRepeat: true,
        amount: 20,
      },
    ],
  },
];
const CURRENCY = "₹";
const TOTAL = 20_534.0;
const TOTAL_INCOME = 64_945.0;
const TOTAL_EXPENSE = 44_872.0;

export default function HomeScreen() {
  const { top } = useSafeAreaInsets();
  const colorScheme = useColorScheme();

  function label(date: Dayjs) {
    if (date.isSame(dayjs(), "day")) {
      return "TODAY";
    }
    if (date.isSame(dayjs().subtract(1, "day"), "day")) {
      return "YESTERDAY";
    }
    return date.format("ddd, D MMM").toLocaleUpperCase();
  }

  function sign(value: number) {
    return value > 0 ? "+" : "-";
  }
  return (
    <View
      style={{
        backgroundColor: Colors[colorScheme].background,
        flex: 1,
        paddingTop: top,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "90%",
          alignSelf: "center",
          paddingVertical: 10,
        }}
      >
        <AntDesign name="search1" size={24} color={Colors[colorScheme].tint} />
        <Ionicons name="filter" size={24} color={Colors[colorScheme].tint} />
      </View>
      <ThemedView style={styles.titleContainer}>
        <SectionList
          ListHeaderComponent={() => {
            return (
              <ThemedView style={styles.totalAmount}>
                <ThemedText
                  type="defaultSemiBold"
                  style={styles.totalAmountText}
                >
                  <ThemedText
                    style={{
                      fontSize: 30,
                      textAlignVertical: "center",
                      color: "lightgray",
                      opacity: 0.3,
                    }}
                  >
                    {sign(TOTAL)} {CURRENCY}
                  </ThemedText>
                  {TOTAL.toLocaleString()}
                </ThemedText>
                <View style={{ flexDirection: "row" }}>
                  <ThemedText>+{TOTAL_INCOME.toLocaleString()}</ThemedText>
                  <View
                    style={{
                      width: 1,
                      opacity: 0.3,
                      backgroundColor: Colors[colorScheme].tint,
                      marginHorizontal: 10,
                      borderRadius: 10,
                    }}
                  />
                  <ThemedText>-{TOTAL_EXPENSE.toLocaleString()}</ThemedText>
                </View>
              </ThemedView>
            );
          }}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
          }}
          renderSectionHeader={({ section: { title, total } }) => (
            <View style={{ marginVertical: 10, opacity: 0.5 }}>
              <ThemedView
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <ThemedText>{label(title)}</ThemedText>
                <ThemedText>
                  {sign(total)}
                  {CURRENCY} {total}
                </ThemedText>
              </ThemedView>
              <ThemedView
                style={{
                  height: 3,
                  backgroundColor: "lightgray",
                  borderRadius: 10,
                  opacity: 0.3,
                  marginTop: 5,
                }}
              />
            </View>
          )}
          sections={MOCK_DATA}
          renderItem={({ item }) => (
            <ThemedView
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginVertical: 5,
              }}
            >
              <View>
                <ThemedText style={{ fontWeight: "600", fontSize: 16 }}>
                  {item.title}
                </ThemedText>
                <ThemedText
                  type="dim"
                  style={{ fontWeight: "300", fontSize: 14 }}
                >
                  {item.timestamp.format("H:MM A")}
                </ThemedText>
              </View>
              <ThemedText
                style={{
                  fontWeight: "600",
                  fontSize: 18,
                  textAlignVertical: "center",
                }}
              >
                {sign(item.amount)}
                {CURRENCY} {item.amount}
              </ThemedText>
            </ThemedView>
          )}
        ></SectionList>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  totalAmountText: {
    fontSize: 48,
  },
  totalAmount: {
    height: 250,
    justifyContent: "center",
    alignItems: "center",
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
    position: "absolute",
  },
});
