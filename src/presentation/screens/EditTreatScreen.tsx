import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { UpdateTreatDto } from "../../application/treat/dto/UpdateTreatDto";
import { RootStackParamList } from "../../types/navigation";
import { useTreatStore } from "../stores/treatStore";

type EditTreatRouteProp = RouteProp<RootStackParamList, "EditTreat">;

export default function EditTreatScreen() {
  const route = useRoute<EditTreatRouteProp>();
  const navigation = useNavigation();
  const { treatId } = route.params;
  const { treats, editTreat } = useTreatStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [costPointsText, setCostPointsText] = useState("");

  useEffect(() => {
    const treat = treats.find((t) => t.id === treatId);
    if (treat) {
      setTitle(treat.title);
      setDescription(treat.description ?? "");
      setCostPointsText(String(treat.costPoints));
    }
  }, [treatId, treats]);

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

    const dto: UpdateTreatDto = {
      id: treatId,
      title: title.trim(),
      description: description.trim() || null,
      costPoints,
    };

    await editTreat(dto);
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
          <Text className="text-white font-bold text-base">保存する</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
