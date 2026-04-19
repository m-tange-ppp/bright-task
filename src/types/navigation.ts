export type RootStackParamList = {
  Main: undefined;
  AddTask: undefined;
  EditTask: { taskId: string };
  TaskDetail: { taskId: string };
};

export type BottomTabParamList = {
  Home: undefined;
  History: undefined;
  Settings: undefined;
};
