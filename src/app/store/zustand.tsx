import { create } from "zustand";

// todo registers data and actualization in real time
type UpdatedStore = {
  updatedAction: boolean;
  setUpdatedAction: () => void;
};

export const useUpdatedStore = create<UpdatedStore>((set) => ({
  updatedAction: true,
  setUpdatedAction: () =>
    set((prevState) => ({
      updatedAction: !prevState.updatedAction,
    })),
}));

// todo change inputs search
type ChangeInputStore = {
  updatedAction: boolean;
  setUpdatedAction: () => void;
};

export const useChangeInputStore = create<ChangeInputStore>((set) => ({
  updatedAction: true,
  setUpdatedAction: () =>
    set((prevState) => ({
      updatedAction: !prevState.updatedAction,
    })),
}));

type ChangeMenuStore = {
  updatedAction: boolean;
  setUpdatedAction: () => void;
};

export const ChangeMenuStore = create<ChangeInputStore>((set) => ({
  updatedAction: true,
  setUpdatedAction: () =>
    set((prevState) => ({
      updatedAction: !prevState.updatedAction,
    })),
}));
