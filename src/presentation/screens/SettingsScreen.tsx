import React, { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { notificationService } from "../../di";

export default function SettingsScreen() {
  const [notificationGranted, setNotificationGranted] = useState<
    boolean | null
  >(null);

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

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-gray-50 px-4 pt-4">
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
    </SafeAreaView>
  );
}
