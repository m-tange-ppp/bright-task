import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { TaskDto } from "../../application/task/dto/TaskDto";
import { UpdateTaskDto } from "../../application/task/dto/UpdateTaskDto";
import { getActiveTasksUseCase, getCompletedTasksUseCase } from "../../di";
import { RootStackParamList } from "../../types/navigation";
import { useTaskStore } from "../stores/taskStore";

type EditTaskRouteProp = RouteProp<RootStackParamList, "EditTask">;
type EditTaskNavProp = NativeStackNavigationProp<RootStackParamList>;

export default function EditTaskScreen() {
  const navigation = useNavigation<EditTaskNavProp>();
  const route = useRoute<EditTaskRouteProp>();
  const { taskId } = route.params;
  const { updateTask } = useTaskStore();

  const [task, setTask] = useState<TaskDto | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dislikeLevel, setDislikeLevel] = useState(3);
  const [importance, setImportance] = useState(3);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [hasTime, setHasTime] = useState(false);
  const [preReminderOffsets, setPreReminderOffsets] = useState<number[]>([]);

  const REMINDER_PRESETS: { label: string; minutes: number }[] = [
    { label: "1時間前", minutes: 60 },
    { label: "半日前", minutes: 720 },
    { label: "1日前", minutes: 1440 },
  ];

  const toggleReminderOffset = (minutes: number) => {
    setPreReminderOffsets((prev) =>
      prev.includes(minutes)
        ? prev.filter((m) => m !== minutes)
        : [...prev, minutes],
    );
  };

  useEffect(() => {
    const fetchTask = async () => {
      const active = await getActiveTasksUseCase.execute();
      const found = active.find((t: TaskDto) => t.id === taskId);
      const t =
        found ??
        (await getCompletedTasksUseCase.execute()).find(
          (t) => t.id === taskId,
        ) ??
        null;
      if (t) {
        setTask(t);
        setTitle(t.title);
        setDescription(t.description ?? "");
        setDislikeLevel(t.dislikeLevel);
        setImportance(t.importance);
        if (t.dueDate) {
          const d = new Date(t.dueDate);
          setDueDate(d);
          setHasTime(t.hasTime);
        }
        setPreReminderOffsets(t.preReminderOffsets ?? []);
      }
    };
    fetchTask();
  }, [taskId]);

  const openDatePicker = () => {
    DateTimePickerAndroid.open({
      value: dueDate ?? new Date(),
      mode: "date",
      minimumDate: new Date(),
      onChange: (_, date) => {
        if (date) {
          const next = new Date(date);
          if (hasTime && dueDate) {
            next.setHours(dueDate.getHours(), dueDate.getMinutes(), 0, 0);
          } else {
            next.setHours(0, 0, 0, 0);
          }
          setDueDate(next);
        }
      },
    });
  };

  const openTimePicker = () => {
    const base = dueDate ? new Date(dueDate) : new Date();
    if (!hasTime) {
      const now = new Date();
      base.setHours(now.getHours(), now.getMinutes(), 0, 0);
    }
    DateTimePickerAndroid.open({
      value: base,
      mode: "time",
      is24Hour: true,
      minuteInterval: 5,
      onChange: (_, date) => {
        if (date && dueDate) {
          const next = new Date(dueDate);
          next.setHours(date.getHours(), date.getMinutes(), 0, 0);
          setDueDate(next);
          setHasTime(true);
        }
      },
    });
  };

  const clearDueDate = () => {
    setDueDate(null);
    setHasTime(false);
    setPreReminderOffsets([]);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("入力エラー", "タスク名を入力してください");
      return;
    }

    const dto: UpdateTaskDto = {
      id: taskId,
      title: title.trim(),
      description: description.trim() || null,
      dislikeLevel,
      importance,
      dueDate: dueDate ? dueDate.toISOString() : null,
      hasTime,
      reminderAt: task?.reminderAt ?? null,
      preReminderOffsets,
    };

    await updateTask(dto);
    navigation.navigate("Main");
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
              value === level
                ? color === "blue"
                  ? "bg-blue-500"
                  : "bg-red-500"
                : "bg-gray-100"
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

  if (!task) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

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
          label="😣 だるさ（1: ちょっと億劫 〜 5: かなり憂鬱）"
          value={dislikeLevel}
          onChange={(v) => {
            Keyboard.dismiss();
            setDislikeLevel(v);
          }}
          color="blue"
        />

        <LevelSelector
          label="⭐ 重要度（1: 軽め 〜 5: 最重要）"
          value={importance}
          onChange={(v) => {
            Keyboard.dismiss();
            setImportance(v);
          }}
          color="red"
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
                  {hasTime ? format(dueDate, "HH:mm") : "時間"}
                </Text>
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

        {dueDate && (
          <View className="mb-5">
            <Text className="text-sm font-semibold text-gray-600 mb-2">
              🔔 リマインダー（任意）
            </Text>
            <Text className="text-xs text-gray-400 mb-3">
              期限の通知は自動で届きます。事前通知を追加できます。
            </Text>
            <View className="flex-row gap-2">
              {REMINDER_PRESETS.map(({ label, minutes }) => {
                const selected = preReminderOffsets.includes(minutes);
                return (
                  <TouchableOpacity
                    key={minutes}
                    onPress={() => toggleReminderOffset(minutes)}
                    className={`flex-1 py-2 rounded-xl items-center border ${
                      selected
                        ? "bg-orange-500 border-orange-500"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <Text
                      className={`text-sm font-semibold ${
                        selected ? "text-white" : "text-gray-500"
                      }`}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        <TouchableOpacity
          className="bg-orange-500 rounded-2xl py-4 items-center mt-2"
          onPress={handleSave}
        >
          <Text className="text-white font-bold text-base">変更を保存する</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
