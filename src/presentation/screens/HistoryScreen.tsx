import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TaskDto } from "../../application/task/dto/TaskDto";
import {
  applySortFilter,
  defaultFilter,
  defaultSort,
  FilterState,
  SortFilterBar,
  SortState,
} from "../components/SortFilterBar";
import { TaskCard } from "../components/TaskCard";
import { useTaskStore } from "../stores/taskStore";

export default function HistoryScreen() {
  const { completedTasks, isLoadingCompleted, loadCompletedTasks } =
    useTaskStore();
  const [sort, setSort] = useState<SortState>(defaultSort);
  const [filter, setFilter] = useState<FilterState>(defaultFilter);

  useFocusEffect(
    useCallback(() => {
      loadCompletedTasks();
    }, []),
  );

  const displayTasks = useMemo(
    () => applySortFilter(completedTasks, sort, filter),
    [completedTasks, sort, filter],
  );

  const totalDislikePoints = useMemo(
    () => completedTasks.reduce((sum, t) => sum + t.dislikeLevel, 0),
    [completedTasks],
  );

  const totalImportancePoints = useMemo(
    () => completedTasks.reduce((sum, t) => sum + t.importance, 0),
    [completedTasks],
  );

  const renderTask = ({ item }: { item: TaskDto }) => (
    <TaskCard item={item} completed />
  );

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-gray-50 pt-4">
      <View className="flex-row gap-3 mb-4 px-4">
        <View className="flex-1 bg-orange-50 rounded-2xl p-4 items-center">
          <Text className="text-3xl font-bold text-orange-500">
            {completedTasks.length}
          </Text>
          <Text className="text-xs text-orange-400 mt-1">完了タスク 🎉</Text>
        </View>
        <View className="flex-1 bg-blue-50 rounded-2xl p-4 items-center">
          <Text className="text-3xl font-bold text-blue-500">
            {totalDislikePoints}
          </Text>
          <Text className="text-xs text-blue-400 mt-1">だるさ合計 🔥</Text>
        </View>
        <View className="flex-1 bg-red-50 rounded-2xl p-4 items-center">
          <Text className="text-3xl font-bold text-red-500">
            {totalImportancePoints}
          </Text>
          <Text className="text-xs text-red-400 mt-1">重要度合計 ⭐</Text>
        </View>
      </View>

      {isLoadingCompleted ? (
        <ActivityIndicator size="large" color="#f97316" className="mt-10" />
      ) : (
        <FlatList
          data={displayTasks}
          keyExtractor={(item) => item.id}
          renderItem={renderTask}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          ListEmptyComponent={
            <Text className="text-center text-gray-400 mt-20 text-base">
              まだ完了したタスクはありません
            </Text>
          }
        />
      )}
      <SortFilterBar
        sort={sort}
        filter={filter}
        onSortChange={setSort}
        onFilterChange={setFilter}
      />
    </SafeAreaView>
  );
}
