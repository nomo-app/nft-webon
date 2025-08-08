import { useState } from "react";
import { GlobalStateContext, type GlobalState } from "./use-global-state";
import { nomo } from "nomo-webon-kit";

export const GlobalStateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, setState] = useState<GlobalState>({
    selectedChain: "zeniq-smart-chain",
    theme: "light",
  });

  const updateState = (updates: Partial<GlobalState>) => {
    setState((prev) => ({ ...prev, ...updates }));
    if (!nomo.runsAsWebOn()) {
      console.log("Applied global state updates", updates);
    }
  };

  return (
    <GlobalStateContext.Provider value={{ state, updateState }}>
      {children}
    </GlobalStateContext.Provider>
  );
};
