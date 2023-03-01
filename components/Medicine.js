import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const listExercisesName = [
  "Chair",
  "Cobra",
  "Dog",
  "No_Pose",
  "Shoulderstand",
  "Traingle",
  "Tree",
  "Warrior",
];

const Medicine = () => {
  return (
    <View
      style={{
        justifyContent: "center",
        height: "100%",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 24, color: "#B08BCC", fontWeight: "bold" }}>Thành tích</Text>
      {/* <TouchableOpacity>
        <Ionicons name="add-circle" size={56} color="black" />
      </TouchableOpacity> */}
      {listExercisesName.map((item, index) => {
        let bgColor = "white";
        let color = "#6096B4";
        if (index % 2 == 0){
          bgColor = "white";
          color = "#6096B4";
        } else {
          bgColor = "#B08BCC";
          color = "white";
        }
        return (
          <View key={index} style={{ backgroundColor: bgColor, margin: 2, width: "90%", borderRadius: 5, padding: 5 }}>
            <Text style={{ fontWeight: "bold", fontStyle: "italic", fontSize: 18, color: color }}>Động tác: {item}</Text>
            <Text style={{color: color}}>Độ chính xác trung bình: {Math.round(Math.random()*100)}%</Text>
            <Text style={{color: color}}>Thời gian chính xác trung bình: {Math.round(Math.random()*10)}s</Text>
          </View>
        );
      })}
    </View>
  );
};

export default Medicine;
