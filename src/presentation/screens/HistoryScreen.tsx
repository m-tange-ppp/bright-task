import { useFocusEffect } from "@react-navigation/native";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import React, { useCallback } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TaskDto } from "../../application/task/dto/TaskDto";
import { useTaskStore } from "../stores/taskStore";

export default function HistoryScreen() {
  const { completedTasks, isLoadingCompleted, loadCompletedTasks } = useTaskStore();

  useFocusEffect(
    useCallback(() => {
      loadCompletedTasks();
    }, [loadCompletedTasks]),
  );

  const renderTask = ({ item }: { item: TaskDto }) => (
    <View className="bg-white rounded-2xl p-4 mb-3 border border-gray-100 opacity-80">
      <Text className="text-base font-semibold text-gray-700">
        {item.title}
      </Text>
      {item.completedAt && (
        <Text className="text-xs text-gray-400 mt-1">
          完了:{" "}
          {format(new Date(item.completedAt), "M月d日 HH:mm", { locale: ja })}
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-gray-50 px-4 pt-4">
      <View className="bg-orange-50 rounded-2xl p-4 mb-4 items-center">
        <Text className="text-3xl font-bold text-orange-500">
          {completedTasks.length}
        </Text>
        <Text className="text-sm text-orange-400 mt-1">完了したタスク 🎉</Text>
      </View>

      {isLoadingCompleted ? (
        <ActivityIndicator size="large" color="#f97316" className="mt-10" />
      ) : (
        <FlatList
          data={completedTasks}
          keyExtractor={(item) => item.id}
          renderItem={renderTask}
          ListEmptyComponent={
            <Text className="text-center text-gray-400 mt-20 text-base">
              まだ完了したタスクはありません
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
}
