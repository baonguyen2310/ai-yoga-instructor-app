import { View, Text, Image, FlatList, TouchableOpacity } from "react-native";
import * as WebBrowser from "expo-web-browser";

const listExercisesName = [
  "Chair",
  "Cobra",
  "Dog",
  "No_Pose",
  "Shoulderstand",
  "Traingle",
  "Tree",
  "Warrior"
];

const DATA = [
  {
    id: "0",
    title: "Chair",
  },
  {
    id: "1",
    title: "Cobra",
  },
  {
    id: "2",
    title: "Dog",
  },
  {
    id: "3",
    title: "No_Pose",
  },
  {
    id: "4",
    title: "Shoulderstand",
  },
  {
    id: "5",
    title: "Traingle",
  },
  {
    id: "6",
    title: "Tree",
  },
  {
    id: "7",
    title: "Warrior",
  },
];

const Exercise = (props) => {
  switch (props.id) {
    case 0:
      return (
        <Image
          source={require("../assets/Chair.jpg")}
          style={{ height: 200, width: "100%" }}
        />
      );
    case 1:
      return (
        <Image
          source={require("../assets/Cobra.jpg")}
          style={{ height: 200, width: "100%" }}
        />
      );
    case 2:
      return (
        <Image
          source={require("../assets/Dog.jpg")}
          style={{ height: 200, width: "100%" }}
        />
      );
    case 3:
      return (
        <Image
          source={require("../assets/No_Pose.jpg")}
          style={{ height: 200, width: "100%" }}
        />
      );
    case 4:
      return (
        <Image
          source={require("../assets/Shoulderstand.jpg")}
          style={{ height: 200, width: "100%" }}
        />
      );
    case 5:
      return (
        <Image
          source={require("../assets/Traingle.jpg")}
          style={{ height: 200, width: "100%" }}
        />
      );
    case 6:
      return (
        <Image
          source={require("../assets/Tree.jpg")}
          style={{ height: 200, width: "100%" }}
        />
      );
    case 7:
      return (
        <Image
          source={require("../assets/Warrior.jpg")}
          style={{ height: 200, width: "100%" }}
        />
      );
  }
};

const handleClick = async (name) => {
  const result = await WebBrowser.openBrowserAsync(
    `https://vercel-build-ai-yoga-instructor.vercel.app/yogaapp?name=${name}`,
    {
      createTask: false,
      enableBarCollapsing: true,
      toolbarColor: "#F0A04B"
    }
  );
};

const ExercisesList = () => {
  return (
    <FlatList
      data={DATA}
      renderItem={({ item }) => {
        return (
          <TouchableOpacity
            style={{ margin: 10 }}
            onPress={() => {
              handleClick(item.title);
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold", color: "white" }}>
              {item.title}
            </Text>
            <Exercise title={item.title} id={Number(item.id)} />
          </TouchableOpacity>
        );
      }}
      keyExtractor={(item) => item.id}
    />
  );
};

export default ExercisesList;
