import { format } from "date-fns";
import { ja } from "date-fns/locale";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { TaskDto } from "../../application/task/dto/TaskDto";

interface Props {
  item: TaskDto;
  onPress?: () => void;
  /** 完了済みカード（opacity + タップ不可） */
  completed?: boolean;
}

function getScoreBg(score: number): string {
  if (score >= 20) return "bg-orange-200";
  if (score >= 12) return "bg-orange-100";
  if (score >= 8) return "bg-orange-50";
  if (score >= 5) return "bg-yellow-50";
  return "bg-white";
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const hasTime = d.getHours() !== 0 || d.getMinutes() !== 0;
  return format(d, hasTime ? "M月d日(EEE) HH:mm" : "M月d日(EEE)", {
    locale: ja,
  });
}

export function TaskCard({ item, onPress, completed = false }: Props) {
  const score = item.dislikeLevel * item.importance;
  const bg = getScoreBg(score);

  const inner = (
    <>
      <View className="flex-row justify-between items-center">
        <Text className="text-base font-semibold text-gray-800 flex-1 mr-2">
          {item.title}
        </Text>
        <View className="flex-row gap-1">
          <View className="bg-blue-100 rounded-full px-2 py-1">
            <Text className="text-xs text-blue-600 font-bold">
              だるさ {item.dislikeLevel}
            </Text>
          </View>
          <View className="bg-red-100 rounded-full px-2 py-1">
            <Text className="text-xs text-red-500 font-bold">
              重要度 {item.importance}
            </Text>
          </View>
        </View>
      </View>
      {item.dueDate && (
        <Text className="text-xs text-gray-400 mt-1.5">
          ⏰ 期限: {formatDate(item.dueDate)}
        </Text>
      )}
      {completed && item.completedAt && (
        <Text className="text-xs text-gray-400 mt-1">
          ✅ 完了: {formatDate(item.completedAt)}
        </Text>
      )}
    </>
  );

  if (completed) {
    return (
      <View
        className={`${bg} rounded-2xl p-4 mb-3 border border-gray-100 opacity-80`}
      >
        {inner}
      </View>
    );
  }

  return (
    <TouchableOpacity
      className={`${bg} rounded-2xl p-4 mb-3 shadow-sm border border-gray-100`}
      onPress={onPress}
    >
      {inner}
    </TouchableOpacity>
  );
}
