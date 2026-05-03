import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TreatDto } from "../../application/treat/dto/TreatDto";
import { RootStackParamList } from "../../types/navigation";
import { TreatCard } from "../components/TreatCard";
import { useTreatStore } from "../stores/treatStore";

type TreatNavProp = NativeStackNavigationProp<RootStackParamList>;

export default function TreatScreen() {
  const navigation = useNavigation<TreatNavProp>();
  const { treats, pointBalance, isLoading, loadTreats, loadPointBalance } =
    useTreatStore();

  useFocusEffect(
    useCallback(() => {
      loadTreats();
      loadPointBalance();
    }, []),
  );

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-gray-50">
      {/* ポイント表示 */}
      <View className="mx-4 mt-4 mb-3 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <Text className="text-xs text-gray-500 mb-1 text-center">
          現在のポイント
        </Text>
        <View className="flex-row items-baseline justify-center gap-1">
          <Text className="text-3xl font-bold text-amber-500">
            {pointBalance?.balance ?? 0}
          </Text>
          <Text className="text-base text-gray-400 font-medium">
            / {pointBalance?.totalEarned ?? 0} pt
          </Text>
        </View>
        <Text className="text-xs text-gray-400 text-center mt-1">
          残ポイント / 合計獲得ポイント
        </Text>
      </View>

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#f97316"
          style={{ marginTop: 40 }}
        />
      ) : (
        <FlatList
          data={treats}
          keyExtractor={(item: TreatDto) => item.id}
          renderItem={({ item }) => (
            <TreatCard
              item={item}
              onPress={() =>
                navigation.navigate("TreatDetail", { treatId: item.id })
              }
            />
          )}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 4 }}
          ListEmptyComponent={
            <Text className="text-center text-gray-400 mt-20 text-base">
              まだごほうびがありません 🎁
            </Text>
          }
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-orange-500 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        onPress={() => navigation.navigate("AddTreat")}
      >
        <Text className="text-white text-3xl font-light">+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
