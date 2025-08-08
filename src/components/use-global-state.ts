import type { NomoEvmNetwork } from "nomo-webon-kit";
import { createContext, useContext } from "react";

export interface GlobalState {
  selectedChain: NomoEvmNetwork;
  theme: "light" | "dark";
}

export const GlobalStateContext = createContext<{
  state: GlobalState;
  updateState: (updates: Partial<GlobalState>) => void;
}>({
  state: {} as GlobalState,
  updateState: () => {
    throw new Error("GlobalStateContext not initialized");
  },
});

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error("useGlobalState must be used within GlobalStateProvider");
  }
  return context;
};
