import { create } from "zustand";
import { CreateTreatDto } from "../../application/treat/dto/CreateTreatDto";
import { PointBalanceDto } from "../../application/treat/dto/PointHistoryDto";
import { TreatDto } from "../../application/treat/dto/TreatDto";
import { UpdateTreatDto } from "../../application/treat/dto/UpdateTreatDto";
import {
  consumeTreatUseCase,
  createTreatUseCase,
  deleteTreatUseCase,
  getPointBalanceUseCase,
  getTreatsUseCase,
  updateTreatUseCase,
} from "../../di";

interface TreatStore {
  treats: TreatDto[];
  pointBalance: PointBalanceDto | null;
  isLoading: boolean;

  loadTreats: () => Promise<void>;
  loadPointBalance: () => Promise<void>;
  addTreat: (dto: CreateTreatDto) => Promise<TreatDto>;
  editTreat: (dto: UpdateTreatDto) => Promise<void>;
  removeTreat: (id: string) => Promise<void>;
  redeemTreat: (treatId: string) => Promise<void>;
}

export const useTreatStore = create<TreatStore>((set) => ({
  treats: [],
  pointBalance: null,
  isLoading: false,

  loadTreats: async () => {
    set({ isLoading: true });
    try {
      const treats = await getTreatsUseCase.execute();
      set({ treats });
    } finally {
      set({ isLoading: false });
    }
  },

  loadPointBalance: async () => {
    const pointBalance = await getPointBalanceUseCase.execute();
    set({ pointBalance });
  },

  addTreat: async (dto) => {
    const treat = await createTreatUseCase.execute(dto);
    set((state) => ({ treats: [...state.treats, treat] }));
    return treat;
  },

  editTreat: async (dto) => {
    await updateTreatUseCase.execute(dto);
    const treats = await getTreatsUseCase.execute();
    set({ treats });
  },

  removeTreat: async (id) => {
    await deleteTreatUseCase.execute(id);
    set((state) => ({ treats: state.treats.filter((t) => t.id !== id) }));
  },

  redeemTreat: async (treatId) => {
    await consumeTreatUseCase.execute(treatId);
    // 残高と交換回数を再取得して同期
    const [pointBalance, treats] = await Promise.all([
      getPointBalanceUseCase.execute(),
      getTreatsUseCase.execute(),
    ]);
    set({ pointBalance, treats });
  },
}));
