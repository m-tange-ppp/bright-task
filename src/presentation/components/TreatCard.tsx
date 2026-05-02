import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { TreatDto } from "../../application/treat/dto/TreatDto";

interface Props {
  item: TreatDto;
  onPress?: () => void;
}

export function TreatCard({ item, onPress }: Props) {
  return (
    <TouchableOpacity
      className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-100"
      onPress={onPress}
    >
      <View className="flex-row justify-between items-center">
        <Text className="text-base font-semibold text-gray-800 flex-1 mr-2">
          {item.title}
        </Text>
        <View className="flex-row gap-2 items-center">
          <View className="bg-amber-100 rounded-full px-2 py-1">
            <Text className="text-xs text-amber-600 font-bold">
              🪙 {item.costPoints} pt
            </Text>
          </View>
          <View className="bg-purple-100 rounded-full px-2 py-1">
            <Text className="text-xs text-purple-600 font-bold">
              {item.consumptionCount} 回
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
