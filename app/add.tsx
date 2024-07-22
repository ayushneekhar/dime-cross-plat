import {
  View,
  Text,
  FlatList,
  Pressable,
  useColorScheme,
  StyleSheet,
} from "react-native";
import React from "react";
import { ThemedText } from "@/components/ThemedText";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import dayjs from "dayjs";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { hexToRgba } from "@/hooks/utils";

const KEYBOARD = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "C"];

const AddTransaction = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const { top } = useSafeAreaInsets();
  const [amount, setAmount] = React.useState("");
  const colorScheme = useColorScheme();

  function date(date: string) {
    if (dayjs(date).isSame(dayjs(), "day")) {
      return `Today, ${dayjs().format("D MMM")}`;
    } else return dayjs(date).format("ddd, D MMM");
  }

  return (
    <View style={{ marginTop: top, flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginRight: 10,
        }}
      >
        <Pressable onPress={() => navigation.goBack()}>
          <AntDesign
            name="closecircle"
            size={34}
            color={Colors[colorScheme].tint}
            style={{ opacity: 0.2, marginLeft: 10 }}
          />
        </Pressable>
        <Pressable
          style={{
            height: 34,
            width: 34,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 100,
            backgroundColor: `#${hexToRgba(Colors[colorScheme].tint, 0.2)}`,
          }}
        >
          <Feather name="repeat" size={18} color={Colors[colorScheme].tint} />
        </Pressable>
      </View>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ThemedText type="title">{amount}</ThemedText>
      </View>
      <View style={{ height: "50%" }}>
        <FlatList
          ListHeaderComponent={() => {
            return (
              <View style={{ flexDirection: "row", gap: 10 }}>
                <Pressable
                  style={[
                    styles.timeStampSections,
                    {
                      flex: 0.6,
                    },
                  ]}
                >
                  <AntDesign
                    name="calendar"
                    size={24}
                    color={Colors[colorScheme].tint}
                    style={{ opacity: 0.3, marginRight: 10 }}
                  />
                  <ThemedText>{date(dayjs().format())}</ThemedText>
                </Pressable>
                <Pressable
                  style={[
                    styles.timeStampSections,
                    {
                      flex: 0.4,
                    },
                  ]}
                >
                  <MaterialIcons
                    name="category"
                    size={24}
                    color={Colors[colorScheme].tint}
                    style={{ opacity: 0.3, marginRight: 10 }}
                  />
                  <ThemedText>Category</ThemedText>
                </Pressable>
              </View>
            );
          }}
          contentContainerStyle={{
            paddingHorizontal: 10,
          }}
          scrollEnabled={false}
          data={KEYBOARD}
          numColumns={3}
          renderItem={({ item, index }) => {
            return (
              <Pressable
                onPress={() => {
                  if (item === "C") {
                    setAmount("");
                  } else {
                    setAmount((prev) => prev + item);
                  }
                }}
                style={[
                  styles.button,
                  { marginHorizontal: index % 3 === 1 ? "3%" : 0 },
                ]}
              >
                <ThemedText style={styles.buttonText}>{item}</ThemedText>
              </Pressable>
            );
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 5,
    borderRadius: 10,
    padding: 20,
    backgroundColor: "rgba(155, 153, 150, 0.3)",
    width: "31%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: { fontSize: 28 },
  timeStampSections: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(155, 153, 150, 0.3)",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    paddingLeft: 10,
  },
});

export default AddTransaction;
