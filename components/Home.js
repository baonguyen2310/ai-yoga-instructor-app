import * as React from "react";
import {
  Button,
  View,
  Text,
  Switch,
  Alert,
  Platform,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Checkbox from "expo-checkbox";
import { Audio } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect, useRef } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { HOST } from "../App";

import ExercisesList from './ExercisesList';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Đã đến giờ luyện tập Yoga",
      body: "Cùng luyện tập với Yoga AI nào!",
      data: { data: "goes here" },
    },
    trigger: { seconds: 2 },
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}

let accessToken;

const Home = ({ route, navigation }) => {
  const [alarm1, setAlarm1] = useState(new Date());
  const [checked1, setChecked1] = useState(false);

  //Refresh
  const [isRefresh, setIsRefresh] = useState(false);

  const handleRefresh = async () => {
    accessToken = await AsyncStorage.getItem("accessToken");
    setIsRefresh((prev) => !prev);
  };

  //Đồng bộ khi khởi động app
  useEffect(() => {
    handleRefresh();
  }, []);

  //Notification
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const handleSwitch1 = async () => {
    setChecked1(!checked1);
    const newChecked1 = !checked1; //dùng biến tạm vì checked1 vẫn chưa chắc được set
    const data = {
      checked1: newChecked1,
      alarm1: alarm1
    };
    console.log(data);
    const accessToken = await AsyncStorage.getItem("accessToken");

    fetch(`${HOST}/alarm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    handleRefresh();
  };

  const handleAlarm = (event, selectedDate, alarm) => {
    if (alarm == "alarm1") {
      setAlarm1(selectedDate);
      setChecked1(false);
    }
  };

  const showMode = (currentMode, alarm) => {
    let value;
    if (alarm == "alarm1") {
      value = alarm1;
    }

    DateTimePickerAndroid.open({
      value: value,
      onChange: (event, selectedDate) =>
        handleAlarm(event, selectedDate, alarm),
      mode: currentMode,
      is24Hour: false,
    });
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = (alarm) => {
    showMode("time", alarm);
  };

  //Mỗi lần mở ứng dụng lên sẽ cập nhật giờ lần đầu
  //Trong khi sử dụng ứng dụng thì sẽ dùng socket để đồng bộ: lười
  //hoặc button đồng bộ
  //dùng useContext thì tốt hơn: lười
  //phát thông báo nền: lười
  useEffect(() => {
    //const accessToken = AsyncStorage.getItem("accessToken");
    console.log(accessToken);
    let timer1IsTook;
    fetch(`${HOST}/alarm`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        data.alarm1 = new Date(data.alarm1);
        const date = new Date();

        setAlarm1(data.alarm1);
        setChecked1(data.checked1);

        let offset1 =
          data.alarm1.getHours() -
          date.getHours() +
          data.alarm1.getMinutes() / 60 -
          date.getMinutes() / 60;
        if (offset1 < 0) {
          offset1 += 1440; //cộng thêm 24 tiếng = 24*60 phút
        }
        timer1IsTook = setTimeout(() => {
          fetch(`${HOST}/alarm`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.checked1 == true) {
                Alert.alert("Đã đến giờ luyện tập Yoga");
                schedulePushNotification();
              }
            });
        }, offset1 * 60 * 1000 + 0 * 60 * 1000);
        
      });
    return () => {
      clearTimeout(timer1IsTook);
    };
  }, [isRefresh]);

  return (
    <View
      style={{
        backgroundColor: route.params.color,
        height: "100%",
      }}
    >
      {/* <Button onPress={showDatepicker} title="Show date picker!" /> */}
      <Text
        style={{
          fontSize: 24,
          textAlign: "center",
          fontWeight: "bold",
          color: route.params.color,
          backgroundColor: "#fff",
          padding: 24,
          marginBottom: 5,
        }}
      >
        HUẤN LUYỆN VIÊN YOGA AI
      </Text>
      <TouchableOpacity
        onPress={() => {
          navigation.setParams({ day: "Mỗi ngày", color: "#F0A04B" });
        }}
      >
        <View
          style={{
            marginTop: 20,
            marginBottom: 20,
            marginRight: 20,
            backgroundColor: "#000",
            padding: 6
          }}
        >
          {route.params == undefined ? (
            <Text style={{ fontSize: 24, fontStyle: "italic", color: "white" }}>
              Mỗi ngày
            </Text>
          ) : (
            <Text style={{ fontSize: 24, fontStyle: "italic", color: "white" }}>
              {route.params.day}
            </Text>
          )}
        </View>
      </TouchableOpacity>
      {/* Morning */}
      <ExercisesList />
      <View
        style={{
          flexDirection: "row",
          margin: 5,
          borderBottomWidth: 2,
          borderBottomColor: "#ccc",
          backgroundColor: "#eee",
          borderRadius: 30,
        }}
      >
        <View
          style={{
            width: "60%",
            justifyContent: "center",
            alignItems: "center",
            height: 100,
          }}
        >
          <TouchableOpacity onPress={() => showTimepicker("alarm1")}>
            <Text
              style={{
                fontSize: 16,
              }}
            >
              Hẹn giờ luyện tập
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 30,
              }}
            >
              {alarm1.getHours()} : {alarm1.getMinutes()}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: "40%",
            justifyContent: "space-around",
            alignItems: "center",
            height: 100,
            flexDirection: "row",
          }}
        >
          <Switch
            thumbColor={"#fff"}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            onValueChange={handleSwitch1}
            value={checked1}
            style={{
              transform: [{ scaleX: 1.8 }, { scaleY: 1.8 }],
            }}
          />
        </View>
      </View>
      <View style={{ position: "absolute", top: "95%", alignSelf: "flex-end" }}>
        <TouchableOpacity onPress={handleRefresh}>
          <Ionicons name="refresh" size={35} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    height: 80,
  },
  countContainer: {
    alignItems: "center",
    padding: 10,
  },
});

export default Home;
