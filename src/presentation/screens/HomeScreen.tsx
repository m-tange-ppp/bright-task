import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TaskDto } from "../../application/task/dto/TaskDto";
import { RootStackParamList } from "../../types/navigation";
import { useTaskStore } from "../stores/taskStore";

type HomeNavProp = NativeStackNavigationProp<RootStackParamList, "Main">;

export default function HomeScreen() {
  const navigation = useNavigation<HomeNavProp>();
  const { activeTasks, isLoading, loadActiveTasks } = useTaskStore();

  useEffect(() => {
    loadActiveTasks();
  }, []);

  const renderTask = ({ item }: { item: TaskDto }) => (
    <TouchableOpacity
      className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-100"
      onPress={() => navigation.navigate("TaskDetail", { taskId: item.id })}
    >
      <View className="flex-row justify-between items-center">
        <Text className="text-base font-semibold text-gray-800 flex-1 mr-2">
          {item.title}
        </Text>
        <View className="bg-orange-100 rounded-full px-2 py-1">
          <Text className="text-xs text-orange-600 font-bold">
            嫌さ {item.dislikeLevel}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50 px-4 pt-4">
      {isLoading ? (
        <ActivityIndicator size="large" color="#f97316" className="mt-10" />
      ) : (
        <FlatList
          data={activeTasks}
          keyExtractor={(item) => item.id}
          renderItem={renderTask}
          ListEmptyComponent={
            <Text className="text-center text-gray-400 mt-20 text-base">
              タスクがありません 🎉
            </Text>
          }
        />
      )}
      <TouchableOpacity
        className="absolute bottom-8 right-6 bg-orange-500 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        onPress={() => navigation.navigate("AddTask")}
      >
        <Text className="text-white text-3xl font-light">+</Text>
      </TouchableOpacity>
    </View>
  );
}
