import { View, Text, TouchableOpacity, Image } from "react-native";

const days = [
  "Thứ hai",
  "Thứ ba",
  "Thứ tư",
  "Thứ năm",
  "Thứ sáu",
  "Thứ bảy",
  "Chủ nhật",
  "Mỗi ngày"
];
const colors = [
  "#5e5473",
  "#E96479",
  "#5dd1e3",
  "#665599",
  "#7DB9B6",
  "#eda65a",
  "#85c78f",
  "#B08BCC"
];

const Calendar = ({ navigation }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        height: "100%",
        alignContent: "center",
      }}
    >
      {days.map((day, index) => {
        return (
          <TouchableOpacity key={index} onPress={ () => { navigation.navigate("Home", {day: day, color: colors[index]}) } }>
            <View
              style={{
                width: 100,
                height: 100,
                backgroundColor: colors[index],
                margin: 10,
                justifyContent: "center",
                borderRadius: 5,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 24,
                  color: "white",
                }}
              >
                {day}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
      <TouchableOpacity style={{margin: 10}}>
        <Image
            source={require("../assets/course.jpg")}
            style={{ height: 240, width: "100%" }}
          />
          <Text style={{fontWeight:"bold", fontSize: 16, backgroundColor: "tomato", color: "white", textAlign: "center"}}>
            Học online với HLV người thật và được hỗ trợ 1:1 bởi HLV AI
          </Text>
          <View style={{flexDirection: "row"}}>
            <Text style={{fontWeight:"bold", flex: 1, fontSize: 16, backgroundColor: "#143F6B", color: "white", textAlign: "center"}}>
              Đăng ký làm huấn luyện viên
            </Text>
            <Text style={{fontWeight:"bold", flex: 1, fontSize: 16, backgroundColor: "#F55353", color: "white", textAlign: "center"}}>
              Đăng ký làm học viên
            </Text>
          </View>
      </TouchableOpacity>
    </View>
  );
};

export default Calendar;
