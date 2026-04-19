import { useFocusEffect } from "@react-navigation/native";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import React, { useCallback, useMemo } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TaskDto } from "../../application/task/dto/TaskDto";
import { useTaskStore } from "../stores/taskStore";

export default function HistoryScreen() {
  const { completedTasks, isLoadingCompleted, loadCompletedTasks } =
    useTaskStore();

  useFocusEffect(
    useCallback(() => {
      loadCompletedTasks();
    }, []),
  );

  const totalDislikePoints = useMemo(
    () => completedTasks.reduce((sum, t) => sum + t.dislikeLevel, 0),
    [completedTasks],
  );

  const totalImportancePoints = useMemo(
    () => completedTasks.reduce((sum, t) => sum + t.importance, 0),
    [completedTasks],
  );

  const getScoreBg = (score: number): string => {
    if (score >= 20) return "bg-orange-300";
    if (score >= 12) return "bg-orange-200";
    if (score >= 8) return "bg-orange-100";
    if (score >= 5) return "bg-orange-50";
    return "bg-white";
  };

  const renderTask = ({ item }: { item: TaskDto }) => {
    const score = item.dislikeLevel * item.importance;
    const bg = getScoreBg(score);
    return (
      <View
        className={`${bg} rounded-2xl p-4 mb-3 border border-gray-100 opacity-80`}
      >
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
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-gray-50 px-4 pt-4">
      <View className="flex-row gap-3 mb-4">
        <View className="flex-1 bg-orange-50 rounded-2xl p-4 items-center">
          <Text className="text-3xl font-bold text-orange-500">
            {completedTasks.length}
          </Text>
          <Text className="text-xs text-orange-400 mt-1">完了タスク 🎉</Text>
        </View>
        <View className="flex-1 bg-red-50 rounded-2xl p-4 items-center">
          <Text className="text-3xl font-bold text-red-500">
            {totalDislikePoints}
          </Text>
          <Text className="text-xs text-red-400 mt-1">だるさ合計 🔥</Text>
        </View>
        <View className="flex-1 bg-blue-50 rounded-2xl p-4 items-center">
          <Text className="text-3xl font-bold text-blue-500">
            {totalImportancePoints}
          </Text>
          <Text className="text-xs text-blue-400 mt-1">重要度合計 ⭐</Text>
        </View>
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
