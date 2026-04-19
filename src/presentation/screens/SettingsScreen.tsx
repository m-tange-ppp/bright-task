import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BulkDeleteScope } from "../../application/task/useCases/BulkDeleteTasksUseCase";
import { notificationService } from "../../di";
import { useTaskStore } from "../stores/taskStore";

export default function SettingsScreen() {
  const [notificationGranted, setNotificationGranted] = useState<
    boolean | null
  >(null);
  const { bulkRemoveTasks } = useTaskStore();

  useEffect(() => {
    notificationService.getPermissionStatus().then(setNotificationGranted);
  }, []);

  const handleRequestPermission = async () => {
    const granted = await notificationService.requestPermission();
    setNotificationGranted(granted);
    if (!granted) {
      Alert.alert(
        "通知が許可されていません",
        "設定アプリから通知を有効にしてください。",
      );
    }
  };

  const confirmBulkDelete = (scope: BulkDeleteScope) => {
    const labels: Record<BulkDeleteScope, string> = {
      active: "未完了タスク",
      completed: "完了済みタスク",
      all: "すべてのタスク",
    };
    Alert.alert(
      `${labels[scope]}を削除`,
      `${labels[scope]}をすべて削除しますか？\nこの操作は元に戻せません。`,
      [
        { text: "キャンセル", style: "cancel" },
        {
          text: "削除する",
          style: "destructive",
          onPress: () => bulkRemoveTasks(scope),
        },
      ],
    );
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-gray-50 px-4 pt-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="bg-white rounded-2xl p-4 mb-4 border border-gray-100">
          <Text className="text-base font-semibold text-gray-700 mb-2">
            プッシュ通知
          </Text>
          <Text className="text-sm text-gray-500 mb-4">
            タスクのリマインダー通知を受け取るには通知を許可してください。
          </Text>

          {notificationGranted === null ? (
            <Text className="text-sm text-gray-400">確認中...</Text>
          ) : notificationGranted ? (
            <Text className="text-sm text-green-600 font-semibold">
              ✅ 通知が許可されています
            </Text>
          ) : (
            <TouchableOpacity
              className="bg-orange-500 rounded-xl py-3 items-center"
              onPress={handleRequestPermission}
            >
              <Text className="text-white font-bold">通知を許可する</Text>
            </TouchableOpacity>
          )}
        </View>

        <View className="bg-white rounded-2xl p-4 mb-4 border border-gray-100">
          <Text className="text-base font-semibold text-gray-700 mb-1">
            タスクの一括削除
          </Text>
          <Text className="text-sm text-gray-400 mb-4">
            削除したタスクは復元できません。
          </Text>

          <TouchableOpacity
            className="bg-red-50 border border-red-200 rounded-xl py-3 px-4 mb-3 flex-row items-center justify-between"
            onPress={() => confirmBulkDelete("active")}
          >
            <Text className="text-red-600 font-semibold">
              未完了タスクをすべて削除
            </Text>
            <Text className="text-red-400">›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-red-50 border border-red-200 rounded-xl py-3 px-4 mb-3 flex-row items-center justify-between"
            onPress={() => confirmBulkDelete("completed")}
          >
            <Text className="text-red-600 font-semibold">
              完了済みタスクをすべて削除
            </Text>
            <Text className="text-red-400">›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-red-100 border border-red-300 rounded-xl py-3 px-4 flex-row items-center justify-between"
            onPress={() => confirmBulkDelete("all")}
          >
            <Text className="text-red-700 font-bold">すべてのタスクを削除</Text>
            <Text className="text-red-500">›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
