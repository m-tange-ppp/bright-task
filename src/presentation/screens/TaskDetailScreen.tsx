import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TaskDto } from "../../application/task/dto/TaskDto";
import { getActiveTasksUseCase, getCompletedTasksUseCase } from "../../di";
import { RootStackParamList } from "../../types/navigation";
import { useTaskStore } from "../stores/taskStore";

type TaskDetailRouteProp = RouteProp<RootStackParamList, "TaskDetail">;

export default function TaskDetailScreen() {
  const route = useRoute<TaskDetailRouteProp>();
  const navigation = useNavigation();
  const { taskId } = route.params;
  const { finishTask, removeTask } = useTaskStore();

  const [task, setTask] = useState<TaskDto | null>(null);

  useEffect(() => {
    // アクティブ・完了どちらにも対応してタスクを検索
    const fetchTask = async () => {
      const active = await getActiveTasksUseCase.execute();
      const found = active.find((t: TaskDto) => t.id === taskId);
      if (found) {
        setTask(found);
        return;
      }
      const completed = await getCompletedTasksUseCase.execute();
      setTask(completed.find((t: TaskDto) => t.id === taskId) ?? null);
    };
    fetchTask();
  }, [taskId]);

  const handleComplete = async () => {
    await finishTask(taskId);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert("削除確認", "このタスクを削除しますか？", [
      { text: "キャンセル", style: "cancel" },
      {
        text: "削除",
        style: "destructive",
        onPress: async () => {
          await removeTask(taskId);
          navigation.goBack();
        },
      },
    ]);
  };

  if (!task) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 px-4 pt-4">
      <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-100">
        <Text className="text-xl font-bold text-gray-800 mb-3">
          {task.title}
        </Text>
        {task.description && (
          <Text className="text-sm text-gray-500 mb-4">{task.description}</Text>
        )}

        <View className="flex-row gap-3">
          <View className="flex-1 bg-orange-50 rounded-xl p-3 items-center">
            <Text className="text-xs text-orange-500 font-semibold">
              だるさ
            </Text>
            <Text className="text-2xl font-bold text-orange-500">
              {task.dislikeLevel}
            </Text>
          </View>
          <View className="flex-1 bg-blue-50 rounded-xl p-3 items-center">
            <Text className="text-xs text-blue-500 font-semibold">重要度</Text>
            <Text className="text-2xl font-bold text-blue-500">
              {task.importance}
            </Text>
          </View>
        </View>
      </View>

      {task.status !== "completed" && (
        <TouchableOpacity
          className="bg-green-500 rounded-2xl py-4 items-center mb-3"
          onPress={handleComplete}
        >
          <Text className="text-white font-bold text-base">✅ 完了！</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        className="bg-red-50 rounded-2xl py-4 items-center border border-red-100"
        onPress={handleDelete}
      >
        <Text className="text-red-500 font-bold text-base">削除する</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
