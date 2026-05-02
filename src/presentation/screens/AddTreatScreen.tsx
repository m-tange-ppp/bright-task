import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { CreateTreatDto } from "../../application/treat/dto/CreateTreatDto";
import { useTreatStore } from "../stores/treatStore";

export default function AddTreatScreen() {
  const navigation = useNavigation();
  const { addTreat } = useTreatStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [costPointsText, setCostPointsText] = useState("");

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("入力エラー", "ごほうび名を入力してください");
      return;
    }

    const costPoints = parseInt(costPointsText, 10);
    if (!costPointsText || isNaN(costPoints) || costPoints < 1) {
      Alert.alert(
        "入力エラー",
        "消費ポイントは 1 以上の整数を入力してください",
      );
      return;
    }

    const dto: CreateTreatDto = {
      title: title.trim(),
      description: description.trim() || null,
      costPoints,
    };

    await addTreat(dto);
    navigation.goBack();
  };

  return (
    <ScrollView
      className="flex-1 bg-gray-50 px-4"
      keyboardShouldPersistTaps="handled"
    >
      <View className="pt-4 pb-10">
        <View className="mb-5">
          <Text className="text-sm font-semibold text-gray-600 mb-2">
            ごほうび名 <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-base"
            placeholder="何をご褒美にしますか？"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View className="mb-5">
          <Text className="text-sm font-semibold text-gray-600 mb-2">
            メモ（任意）
          </Text>
          <TextInput
            className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-base"
            placeholder="詳細など..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />
        </View>

        <View className="mb-8">
          <Text className="text-sm font-semibold text-gray-600 mb-2">
            🪙 消費ポイント <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-base"
            placeholder="例: 10"
            value={costPointsText}
            onChangeText={setCostPointsText}
            keyboardType="number-pad"
          />
        </View>

        <TouchableOpacity
          className="bg-orange-500 rounded-xl py-4 items-center shadow-sm"
          onPress={handleSave}
        >
          <Text className="text-white font-bold text-base">追加する</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
