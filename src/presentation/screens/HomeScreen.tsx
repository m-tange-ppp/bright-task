import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TaskDto } from "../../application/task/dto/TaskDto";
import { RootStackParamList } from "../../types/navigation";
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

type HomeNavProp = NativeStackNavigationProp<RootStackParamList, "Main">;

export default function HomeScreen() {
  const navigation = useNavigation<HomeNavProp>();
  const { activeTasks, isLoadingActive, loadActiveTasks } = useTaskStore();
  const [sort, setSort] = useState<SortState>(defaultSort);
  const [filter, setFilter] = useState<FilterState>(defaultFilter);

  useFocusEffect(
    useCallback(() => {
      loadActiveTasks();
    }, []),
  );

  const displayTasks = useMemo(
    () => applySortFilter(activeTasks, sort, filter),
    [activeTasks, sort, filter],
  );

  const renderTask = ({ item }: { item: TaskDto }) => (
    <TaskCard
      item={item}
      onPress={() => navigation.navigate("TaskDetail", { taskId: item.id })}
    />
  );

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-gray-50 pt-4">
      {isLoadingActive ? (
        <ActivityIndicator size="large" color="#f97316" className="mt-10" />
      ) : (
        <FlatList
          data={displayTasks}
          keyExtractor={(item) => item.id}
          renderItem={renderTask}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          ListEmptyComponent={
            <Text className="text-center text-gray-400 mt-20 text-base">
              タスクがありません 🎉
            </Text>
          }
        />
      )}
      <TouchableOpacity
        className="self-end mr-4 mb-3 bg-orange-500 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        onPress={() => navigation.navigate("AddTask")}
      >
        <Text className="text-white text-3xl font-light">+</Text>
      </TouchableOpacity>
      <SortFilterBar
        sort={sort}
        filter={filter}
        onSortChange={setSort}
        onFilterChange={setFilter}
      />
    </SafeAreaView>
  );
}
