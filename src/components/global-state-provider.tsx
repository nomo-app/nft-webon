import { useEffect, useState } from "react";
import { GlobalStateContext, type GlobalState } from "./use-global-state";
import { nomo, type NomoEvmNetwork } from "nomo-webon-kit";
import { fetchNftBalances } from "../lib/web3/nft-balance-fetching";

export const GlobalStateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, setState] = useState<GlobalState>({
    selectedChain: "zeniq-smart-chain",
    theme: "light",
    nfts: null,
  });

  async function fetchChainData(chain: NomoEvmNetwork) {
    setState((prev) => ({ ...prev, nfts: null }));
    const nfts = await fetchNftBalances({ chain });
    console.log("Fetched NFTs for chain:", chain, nfts);
    setState((prev) => ({ ...prev, nfts }));
  }

  useEffect(() => {
    fetchChainData(state.selectedChain);
  }, [state.selectedChain]);

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
