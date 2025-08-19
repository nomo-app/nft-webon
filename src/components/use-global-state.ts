import type { NomoEvmNetwork } from "nomo-webon-kit";
import { createContext, useContext } from "react";
import type { ExtendedNft } from "../lib/types/Nft";

export interface GlobalState {
  selectedChain: NomoEvmNetwork;
  theme: "light" | "dark";
  nfts: ExtendedNft[] | null;
  fetchError: string | null;
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
