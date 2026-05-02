export type RootStackParamList = {
  Main: undefined;
  AddTask: undefined;
  EditTask: { taskId: string };
  TaskDetail: { taskId: string };
  AddTreat: undefined;
  EditTreat: { treatId: string };
  TreatDetail: { treatId: string };
};

export type BottomTabParamList = {
  Home: undefined;
  History: undefined;
  Treat: undefined;
  Settings: undefined;
};
