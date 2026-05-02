import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
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
import { TreatDto } from "../../application/treat/dto/TreatDto";
import { RootStackParamList } from "../../types/navigation";
import { useTreatStore } from "../stores/treatStore";

type TreatDetailRouteProp = RouteProp<RootStackParamList, "TreatDetail">;
type TreatDetailNavProp = NativeStackNavigationProp<RootStackParamList>;

export default function TreatDetailScreen() {
  const route = useRoute<TreatDetailRouteProp>();
  const navigation = useNavigation<TreatDetailNavProp>();
  const { treatId } = route.params;
  const {
    treats,
    pointBalance,
    redeemTreat,
    removeTreat,
    loadTreats,
    loadPointBalance,
  } = useTreatStore();

  const [treat, setTreat] = useState<TreatDto | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);

  useEffect(() => {
    const found = treats.find((t) => t.id === treatId) ?? null;
    setTreat(found);
  }, [treats, treatId]);

  useEffect(() => {
    // ストアが空の場合はロード
    if (treats.length === 0) {
      loadTreats();
    }
    if (!pointBalance) {
      loadPointBalance();
    }
  }, []);

  const handleEdit = () => {
    navigation.navigate("EditTreat", { treatId });
  };

  const handleDelete = () => {
    if (!treat) return;
    Alert.alert("削除確認", `「${treat.title}」を削除しますか？`, [
      { text: "キャンセル", style: "cancel" },
      {
        text: "削除",
        style: "destructive",
        onPress: async () => {
          await removeTreat(treatId);
          navigation.goBack();
        },
      },
    ]);
  };

  const handleRedeem = () => {
    if (!treat) return;

    const balance = pointBalance?.balance ?? 0;
    if (balance < treat.costPoints) {
      Alert.alert(
        "ポイント不足",
        `ポイントが足りません\n（残高: ${balance} pt / 必要: ${treat.costPoints} pt）`,
      );
      return;
    }

    Alert.alert(
      "ごほうびを交換",
      `「${treat.title}」を ${treat.costPoints} pt で交換しますか？`,
      [
        { text: "キャンセル", style: "cancel" },
        {
          text: "交換する",
          onPress: async () => {
            setIsRedeeming(true);
            try {
              await redeemTreat(treatId);
              await Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success,
              );
              Alert.alert("交換完了 🎉", `「${treat.title}」を交換しました！`);
            } catch (e: unknown) {
              const message =
                e instanceof Error ? e.message : "交換に失敗しました";
              Alert.alert("エラー", message);
            } finally {
              setIsRedeeming(false);
            }
          },
        },
      ],
    );
  };

  if (!treat) {
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
          {treat.title}
        </Text>

        {treat.description && (
          <Text className="text-sm text-gray-500 mb-4">
            {treat.description}
          </Text>
        )}

        <View className="flex-row gap-3">
          <View className="flex-1 bg-amber-50 rounded-xl p-3 items-center">
            <Text className="text-xs text-gray-500 mb-1">消費ポイント</Text>
            <Text className="text-2xl font-bold text-amber-500">
              {treat.costPoints}
            </Text>
            <Text className="text-xs text-gray-400">pt</Text>
          </View>
          <View className="flex-1 bg-purple-50 rounded-xl p-3 items-center">
            <Text className="text-xs text-gray-500 mb-1">交換回数</Text>
            <Text className="text-2xl font-bold text-purple-500">
              {treat.consumptionCount}
            </Text>
            <Text className="text-xs text-gray-400">回</Text>
          </View>
        </View>
      </View>

      {/* ポイント残高 */}
      <View className="bg-white rounded-2xl p-4 mb-6 shadow-sm border border-gray-100 flex-row items-center justify-between">
        <Text className="text-sm text-gray-500">現在の残ポイント</Text>
        <Text className="text-xl font-bold text-amber-500">
          {pointBalance?.balance ?? 0} pt
        </Text>
      </View>

      {/* 編集ボタン */}
      <TouchableOpacity
        className="bg-orange-400 rounded-xl py-4 items-center border border-gray-300 mb-3"
        onPress={handleEdit}
      >
        <Text className="text-white font-bold text-base">✏️ 編集する</Text>
      </TouchableOpacity>

      {/* 交換ボタン */}
      <TouchableOpacity
        className={`rounded-xl py-4 items-center shadow-sm mb-3 ${
          isRedeeming ? "bg-gray-300" : "bg-green-400"
        }`}
        onPress={handleRedeem}
        disabled={isRedeeming}
      >
        <Text className="text-white font-bold text-base">
          {isRedeeming ? "交換中..." : "🎁 交換する"}
        </Text>
      </TouchableOpacity>

      {/* 削除ボタン（交換回数0のときのみ） */}
      {treat.consumptionCount === 0 && (
        <TouchableOpacity
          className="bg-red-400 rounded-xl py-4 items-center border border-red-200 mb-6"
          onPress={handleDelete}
        >
          <Text className="text-white font-bold text-base">🗑️ 削除する</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}
