import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./global.css";
import { notificationService } from "./src/di";
import { initSchema } from "./src/infrastructure/db/schema";
import AddTaskScreen from "./src/presentation/screens/AddTaskScreen";
import HistoryScreen from "./src/presentation/screens/HistoryScreen";
import HomeScreen from "./src/presentation/screens/HomeScreen";
import SettingsScreen from "./src/presentation/screens/SettingsScreen";
import TaskDetailScreen from "./src/presentation/screens/TaskDetailScreen";
import { BottomTabParamList, RootStackParamList } from "./src/types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#f97316",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarStyle: { paddingBottom: 4 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "タスク",
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 18 }}>📋</Text>
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: "達成記録",
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 18 }}>🏆</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: "設定",
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 18 }}>⚙️</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    initSchema();
    notificationService.requestPermission();
  }, []);

  return (
    <SafeAreaProvider>
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        screenOptions={{
          headerTintColor: "#f97316",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        <Stack.Screen
          name="Main"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddTask"
          component={AddTaskScreen}
          options={{ title: "タスクを追加" }}
        />
        <Stack.Screen
          name="TaskDetail"
          component={TaskDetailScreen}
          options={{ title: "タスク詳細" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </SafeAreaProvider>
  );
}
