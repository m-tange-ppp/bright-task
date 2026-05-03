# Bright Task

> 気が進まないタスクを前向きに片付けるタスク管理アプリ

---

## 概要

**Bright Task** は、「嫌だ」「億劫」と感じるタスクを識別し、先延ばしを防ぐ仕組みを提供するタスク管理アプリです。

- 嫌さレベル × 重要度で優先スコアを自動算出し、やるべきタスクを明確にする
- タスク完了でポイントを獲得し、ごほうびと交換できる達成感の仕組みを提供する
- ユーザーを責めるのではなく、背中を押すアプローチの UI/UX を重視する

---

## スクリーンショット

<!-- TODO: スクリーンショットを追加 -->

---

## 技術スタック

| カテゴリ             | ライブラリ                                          |
| -------------------- | --------------------------------------------------- |
| フレームワーク       | Expo managed (SDK 54) + TypeScript                  |
| 対象プラットフォーム | Android のみ（初期バージョン）                      |
| ナビゲーション       | React Navigation 7 (`native-stack` / `bottom-tabs`) |
| 状態管理             | Zustand（UI 状態のみ）                              |
| ローカル DB          | expo-sqlite                                         |
| 通知                 | expo-notifications                                  |
| スタイリング         | NativeWind v4 (Tailwind CSS 構文)                   |
| アニメーション       | react-native-reanimated                             |
| 触覚フィードバック   | expo-haptics                                        |
| 日付処理             | date-fns                                            |
| UUID 生成            | expo-crypto (`Crypto.randomUUID()`)                 |

---

## セットアップ

### 前提条件

- Node.js (LTS)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Android エミュレーターまたは実機

### インストール

```bash
git clone https://github.com/your-username/bright-task.git
cd bright-task
npm install
```

### 起動

```bash
# 開発サーバー起動
npx expo start

# Android ビルド
npx expo run:android

# プレビューインストール
eas build -p android --profile preview

# 型チェック
npx tsc --noEmit
```

---

## アーキテクチャ

本プロジェクトは **ドメイン駆動設計（DDD）** を採用しています。ビジネスロジックをドメイン層に集約し、インフラ・UI の実装詳細から切り離します。

### レイヤー構成

```
Presentation → Application → Domain ← Infrastructure
```

| レイヤー           | 責務                                                           |
| ------------------ | -------------------------------------------------------------- |
| **Domain**         | エンティティ・値オブジェクト・ドメインサービス・リポジトリ I/F |
| **Application**    | ユースケース。Domain を使ってユーザー操作を実現する            |
| **Infrastructure** | リポジトリ実装（SQLite）・通知サービス実装                     |
| **Presentation**   | 画面・コンポーネント・Zustand ストア                           |

### ドメインモデル

**Task コンテキスト**

- エンティティ: `Task`（集約ルート）
- 値オブジェクト: `TaskId`, `DislikeLevel`（1–5）, `Importance`（1–5）, `TaskStatus`
- ドメインサービス: `TaskPriorityService`（嫌さ × 重要度から優先スコアを算出）
- ドメインイベント: `TaskCompletedEvent`

**Treat コンテキスト**

- エンティティ: `Treat`（集約ルート）, `PointHistory`（不変エンティティ）
- 値オブジェクト: `TreatId`, `CostPoints`（1以上の整数）, `PointHistoryId`
- ドメインサービス: `PointBalanceService`（dislike ポイントの残高・累積獲得合計を算出）

### フォルダ構成

```
src/
  domain/
    shared/
      DomainEventBus.ts          # 同期ドメインイベントバス
    task/
      entities/Task.ts
      valueObjects/              # TaskId, DislikeLevel, Importance, TaskStatus
      repositories/ITaskRepository.ts
      services/TaskPriorityService.ts
      events/TaskCompletedEvent.ts
    treat/
      entities/                  # Treat, PointHistory
      valueObjects/              # TreatId, CostPoints, PointHistoryId
      repositories/              # ITreatRepository, IPointHistoryRepository
      services/PointBalanceService.ts

  application/
    task/
      useCases/                  # CreateTask, CompleteTask, UpdateTask, ...
      dto/                       # CreateTaskDto, UpdateTaskDto, TaskDto
    treat/
      useCases/                  # CreateTreat, ConsumeTreat, GetPointBalance, ...
      eventHandlers/
        OnTaskCompletedRecordPoints.ts

  infrastructure/
    db/
      SQLiteTaskRepository.ts
      SQLiteTreatRepository.ts
      SQLitePointHistoryRepository.ts
      schema.ts
    notifications/
      ExpoNotificationService.ts

  presentation/
    screens/                     # HomeScreen, AddTaskScreen, HistoryScreen, ...
    components/                  # TaskCard, TreatCard, SortFilterBar
    stores/                      # taskStore, treatStore（UI 状態のみ）
    hooks/

  di.ts                          # 依存性注入・DomainEventBus subscribe 登録
```

---

## 画面構成

| 画面               | 役割                                         |
| ------------------ | -------------------------------------------- |
| `HomeScreen`       | 今日のタスク一覧（嫌さレベル順ソート対応）   |
| `AddTaskScreen`    | タスク追加フォーム（嫌さレベル入力 UI 含む） |
| `EditTaskScreen`   | タスク編集フォーム                           |
| `TaskDetailScreen` | 詳細表示・編集・完了処理                     |
| `HistoryScreen`    | 完了済み一覧 + 達成記録                      |
| `SettingsScreen`   | 通知設定                                     |

---

## データモデル

### `tasks` テーブル

| カラム                 | 型            | 説明                                                |
| ---------------------- | ------------- | --------------------------------------------------- |
| `id`                   | TEXT PK       | UUID                                                |
| `title`                | TEXT NOT NULL | タスク名                                            |
| `description`          | TEXT          | 詳細メモ                                            |
| `dislike_level`        | INTEGER (1–5) | 嫌さレベル                                          |
| `importance`           | INTEGER (1–5) | 重要度                                              |
| `status`               | TEXT          | `pending` / `in_progress` / `completed` / `snoozed` |
| `due_date`             | TEXT          | 期限日時 (ISO 8601)                                 |
| `reminder_at`          | TEXT          | 通知タイミング (ISO 8601)                           |
| `pre_reminder_offsets` | TEXT          | 期限前通知のオフセット配列 (JSON, 分単位)           |
| `notification_ids`     | TEXT          | スケジュール済み通知 ID の配列 (JSON)               |
| `has_time`             | INTEGER (0/1) | 期限時刻の有無                                      |
| `completed_at`         | TEXT          | 完了日時                                            |
| `created_at`           | TEXT          | 作成日時                                            |
| `updated_at`           | TEXT          | 更新日時                                            |

### `treats` テーブル

| カラム        | 型            | 説明           |
| ------------- | ------------- | -------------- |
| `id`          | TEXT PK       | UUID           |
| `title`       | TEXT NOT NULL | ごほうび名     |
| `description` | TEXT          | 詳細メモ       |
| `cost_points` | INTEGER       | 消費ポイント数 |
| `created_at`  | TEXT          | 作成日時       |
| `updated_at`  | TEXT          | 更新日時       |

### `point_history` テーブル

| カラム          | 型            | 説明                                                                |
| --------------- | ------------- | ------------------------------------------------------------------- |
| `id`            | TEXT PK       | UUID                                                                |
| `task_id`       | TEXT NULL     | 関連タスク ID（`task_complete` 時のみ設定）                         |
| `treat_id`      | TEXT NULL     | 関連ごほうび ID（`treat_consumption` 時のみ。Treat 削除で NULL 化） |
| `type`          | TEXT NOT NULL | `"dislike"` / `"importance"`                                        |
| `change_points` | INTEGER       | 符号付き増減量（+加算 / -減算）                                     |
| `reason`        | TEXT NOT NULL | `"task_complete"` / `"treat_consumption"`                           |
| `created_at`    | TEXT          | 作成日時                                                            |

> ポイント残高は `point_history` の `SUM(change_points)` で都度計算します（キャッシュテーブルなし）。残高計算・ごほうび消費は `type = 'dislike'` のみ対象。

---

## ライセンス

<!-- TODO: ライセンスを追加 -->
