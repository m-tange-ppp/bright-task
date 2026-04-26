import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { TaskDto } from "../../application/task/dto/TaskDto";

export type SortKey = "dueDate" | "dislikeLevel" | "importance";
export type SortDir = "asc" | "desc";

export interface SortState {
  key: SortKey;
  dir: SortDir;
}

export interface FilterState {
  dislikeLevelMin: number;
  dislikeLevelMax: number;
  importanceMin: number;
  importanceMax: number;
}

export const defaultSort: SortState = { key: "dueDate", dir: "asc" };
export const defaultFilter: FilterState = {
  dislikeLevelMin: 1,
  dislikeLevelMax: 5,
  importanceMin: 1,
  importanceMax: 5,
};

interface Props {
  sort: SortState;
  filter: FilterState;
  onSortChange: (sort: SortState) => void;
  onFilterChange: (filter: FilterState) => void;
}

const SORT_LABELS: { key: SortKey; label: string }[] = [
  { key: "dueDate", label: "期限" },
  { key: "dislikeLevel", label: "だるさ" },
  { key: "importance", label: "重要度" },
];

const LEVELS = [1, 2, 3, 4, 5];

export function SortFilterBar({
  sort,
  filter,
  onSortChange,
  onFilterChange,
}: Props) {
  const [filterOpen, setFilterOpen] = useState(false);

  const handleSortPress = (key: SortKey) => {
    if (sort.key === key) {
      onSortChange({ key, dir: sort.dir === "asc" ? "desc" : "asc" });
    } else {
      onSortChange({ key, dir: "asc" });
    }
  };

  const isFilterActive =
    filter.dislikeLevelMin !== 1 ||
    filter.dislikeLevelMax !== 5 ||
    filter.importanceMin !== 1 ||
    filter.importanceMax !== 5;

  return (
    <View className="mb-4">
      {/* フィルターパネル */}
      {filterOpen && (
        <View className="bg-white p-3 border-x border-t border-gray-200 gap-3">
          <FilterRow
            label="だるさ"
            color="blue"
            min={filter.dislikeLevelMin}
            max={filter.dislikeLevelMax}
            onMinChange={(v) =>
              onFilterChange({ ...filter, dislikeLevelMin: v })
            }
            onMaxChange={(v) =>
              onFilterChange({ ...filter, dislikeLevelMax: v })
            }
          />
          <FilterRow
            label="重要度"
            color="red"
            min={filter.importanceMin}
            max={filter.importanceMax}
            onMinChange={(v) => onFilterChange({ ...filter, importanceMin: v })}
            onMaxChange={(v) => onFilterChange({ ...filter, importanceMax: v })}
          />
          <TouchableOpacity
            onPress={() => onFilterChange(defaultFilter)}
            className="self-end"
          >
            <Text
              className={`text-xs font-semibold ${
                isFilterActive ? "text-blue-500" : "text-gray-300"
              }`}
            >
              リセット
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ソート・フィルター 一体型パネル */}
      <View className="flex-row border border-gray-200 overflow-hidden">
        {SORT_LABELS.map(({ key, label }) => {
          const active = sort.key === key;
          const arrow = sort.dir === "asc" ? "↓" : "↑";
          return (
            <TouchableOpacity
              key={key}
              onPress={() => handleSortPress(key)}
              className={`flex-1 items-center justify-center py-4 border-r border-gray-200 ${
                active ? "bg-orange-500" : "bg-white"
              }`}
            >
              <Text
                numberOfLines={1}
                className={`text-xs font-semibold ${active ? "text-white" : "text-gray-600"}`}
              >
                {label}
                {active ? ` ${arrow}` : ""}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* フィルタートグル */}
        <TouchableOpacity
          onPress={() => setFilterOpen((v) => !v)}
          className={`flex-1 items-center justify-center py-4 ${
            isFilterActive
              ? "bg-blue-500"
              : filterOpen
                ? "bg-gray-100"
                : "bg-white"
          }`}
        >
          <Text
            numberOfLines={1}
            className={`text-xs font-semibold ${isFilterActive ? "text-white" : "text-gray-600"}`}
          >
            {isFilterActive
              ? "フィルター ▾"
              : filterOpen
                ? "フィルター ▴"
                : "フィルター ▾"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

interface FilterRowProps {
  label: string;
  color: "blue" | "red";
  min: number;
  max: number;
  onMinChange: (v: number) => void;
  onMaxChange: (v: number) => void;
}

function FilterRow({
  label,
  color,
  min,
  max,
  onMinChange,
  onMaxChange,
}: FilterRowProps) {
  const endpointBg =
    color === "red"
      ? "bg-red-500 border-red-500"
      : "bg-blue-500 border-blue-500";
  const rangeBg =
    color === "red"
      ? "bg-red-100 border-red-200"
      : "bg-blue-100 border-blue-200";
  const endpointText = "text-white";
  const rangeText = color === "red" ? "text-red-600" : "text-blue-600";
  const handlePress = (v: number) => {
    // 同じ値を2回タップ → ピンポイント指定
    if (v === min && v === max) {
      return;
    }
    if (v === min) {
      onMaxChange(v);
      return;
    }
    if (v === max) {
      onMinChange(v);
      return;
    }
    if (v < min) {
      onMinChange(v);
    } else if (v > max) {
      onMaxChange(v);
    } else {
      const distMin = v - min;
      const distMax = max - v;
      if (distMin <= distMax) {
        onMinChange(v);
      } else {
        onMaxChange(v);
      }
    }
  };

  return (
    <View>
      <View className="flex-row items-center justify-between mb-1.5">
        <Text className="text-xs text-gray-500">{label}</Text>
        <Text className="text-xs text-gray-400">
          {min === max ? `= ${min}` : `${min} 〜 ${max}`}
        </Text>
      </View>
      <View className="flex-row items-center gap-1.5">
        {LEVELS.map((v) => {
          const isMin = v === min;
          const isMax = v === max;
          const inRange = v > min && v < max;
          const isEndpoint = isMin || isMax;
          return (
            <TouchableOpacity
              key={v}
              onPress={() => handlePress(v)}
              className={`flex-1 h-8 rounded-lg items-center justify-center border ${
                isEndpoint
                  ? endpointBg
                  : inRange
                    ? rangeBg
                    : "bg-white border-gray-200"
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  isEndpoint
                    ? endpointText
                    : inRange
                      ? rangeText
                      : "text-gray-400"
                }`}
              >
                {v}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

/** ソート・フィルターを適用したタスク一覧を返す */
export function applySortFilter(
  tasks: TaskDto[],
  sort: SortState,
  filter: FilterState,
): TaskDto[] {
  const filtered = tasks.filter(
    (t) =>
      t.dislikeLevel >= filter.dislikeLevelMin &&
      t.dislikeLevel <= filter.dislikeLevelMax &&
      t.importance >= filter.importanceMin &&
      t.importance <= filter.importanceMax,
  );

  return [...filtered].sort((a, b) => {
    let cmp = 0;
    if (sort.key === "dueDate") {
      const aVal = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const bVal = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      cmp = aVal - bVal;
    } else if (sort.key === "dislikeLevel") {
      cmp = a.dislikeLevel - b.dislikeLevel;
    } else if (sort.key === "importance") {
      cmp = a.importance - b.importance;
    }
    return sort.dir === "asc" ? cmp : -cmp;
  });
}
