import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { CreateTaskDto } from "../../application/task/dto/CreateTaskDto";
import { useTaskStore } from "../stores/taskStore";

export default function AddTaskScreen() {
  const navigation = useNavigation();
  const { addTask } = useTaskStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dislikeLevel, setDislikeLevel] = useState(3);
  const [importance, setImportance] = useState(3);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [hasTime, setHasTime] = useState(false);

  const openDatePicker = () => {
    DateTimePickerAndroid.open({
      value: dueDate ?? new Date(),
      mode: "date",
      minimumDate: new Date(),
      onChange: (_, date) => {
        if (date) {
          const next = new Date(date);
          // 既に時間が設定済みなら時間を引き継ぐ
          if (hasTime && dueDate) {
            next.setHours(dueDate.getHours(), 0, 0, 0);
          } else {
            next.setHours(0, 0, 0, 0);
          }
          setDueDate(next);
        }
      },
    });
  };

  const openTimePicker = () => {
    DateTimePickerAndroid.open({
      value: dueDate ?? new Date(),
      mode: "time",
      is24Hour: true,
      minuteInterval: 60, // 時間単位のみ
      onChange: (_, date) => {
        if (date && dueDate) {
          const next = new Date(dueDate);
          next.setHours(date.getHours(), 0, 0, 0);
          setDueDate(next);
          setHasTime(true);
        }
      },
    });
  };

  const clearDueDate = () => {
    setDueDate(null);
    setHasTime(false);
  };

  const clearTime = () => {
    if (dueDate) {
      const next = new Date(dueDate);
      next.setHours(0, 0, 0, 0);
      setDueDate(next);
    }
    setHasTime(false);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("入力エラー", "タスク名を入力してください");
      return;
    }

    const dto: CreateTaskDto = {
      title: title.trim(),
      description: description.trim() || null,
      dislikeLevel,
      importance,
      dueDate: dueDate ? dueDate.toISOString() : null,
      reminderAt: null,
    };

    await addTask(dto);
    navigation.goBack();
  };

  const LevelSelector = ({
    label,
    value,
    onChange,
    color,
  }: {
    label: string;
    value: number;
    onChange: (v: number) => void;
    color: string;
  }) => (
    <View className="mb-5">
      <Text className="text-sm font-semibold text-gray-600 mb-2">{label}</Text>
      <View className="flex-row gap-2">
        {[1, 2, 3, 4, 5].map((level) => (
          <TouchableOpacity
            key={level}
            onPress={() => onChange(level)}
            className={`flex-1 h-10 rounded-xl items-center justify-center ${
              value === level ? `bg-${color}-500` : "bg-gray-100"
            }`}
          >
            <Text
              className={`font-bold ${
                value === level ? "text-white" : "text-gray-500"
              }`}
            >
              {level}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView
      className="flex-1 bg-gray-50 px-4"
      keyboardShouldPersistTaps="handled"
    >
      <View className="pt-4 pb-10">
        <View className="mb-5">
          <Text className="text-sm font-semibold text-gray-600 mb-2">
            タスク名 <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-base"
            placeholder="何をやりますか？"
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
            placeholder="詳細や理由など..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />
        </View>

        <LevelSelector
          label="😣 だるさレベル（1: ちょっと億劫 〜 5: かなり憂鬱）"
          value={dislikeLevel}
          onChange={setDislikeLevel}
          color="orange"
        />

        <LevelSelector
          label="⭐ 重要度（1: 軽め 〜 5: 最重要）"
          value={importance}
          onChange={setImportance}
          color="orange"
        />

        <View className="mb-5">
          <Text className="text-sm font-semibold text-gray-600 mb-2">
            📅 期限（任意）
          </Text>
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              onPress={openDatePicker}
              className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3"
            >
              <Text
                className={
                  dueDate
                    ? "text-gray-800 text-base"
                    : "text-gray-400 text-base"
                }
              >
                {dueDate
                  ? format(dueDate, "yyyy年M月d日（E）", { locale: ja })
                  : "日付を選択..."}
              </Text>
            </TouchableOpacity>
            {dueDate && (
              <TouchableOpacity
                onPress={openTimePicker}
                className={`bg-white border rounded-xl px-3 py-3 ${hasTime ? "border-orange-300" : "border-gray-200"}`}
              >
                <Text
                  className={
                    hasTime
                      ? "text-orange-500 text-sm font-semibold"
                      : "text-gray-400 text-sm"
                  }
                >
                  {hasTime ? format(dueDate, "H時") : "時間"}
                </Text>
              </TouchableOpacity>
            )}
            {dueDate && hasTime && (
              <TouchableOpacity
                onPress={clearTime}
                className="bg-gray-100 rounded-xl px-2 py-3"
              >
                <Text className="text-gray-400 text-xs">時間クリア</Text>
              </TouchableOpacity>
            )}
            {dueDate && (
              <TouchableOpacity
                onPress={clearDueDate}
                className="bg-gray-100 rounded-xl px-3 py-3"
              >
                <Text className="text-gray-500 text-sm">クリア</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <TouchableOpacity
          className="bg-orange-500 rounded-2xl py-4 items-center mt-2"
          onPress={handleSave}
        >
          <Text className="text-white font-bold text-base">
            タスクを追加する
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
