import type { NomoEvmNetwork } from "nomo-webon-kit";
import React from "react";
import { useGlobalState } from "./use-global-state";

const chainOptions: { name: string; value: NomoEvmNetwork }[] = [
  {
    name: "Zeniq",
    value: "zeniq-smart-chain",
  },
  {
    name: "Ethereum",
    value: "ethereum",
  },
  {
    name: "Polygon",
    value: "polygon",
  },
];

export const ChainSelect: React.FC = () => {
  const { updateState } = useGlobalState();

  const handleChainChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedChain = event.target.value as NomoEvmNetwork;
    updateState({ selectedChain });
  };

  return (
    <div>
      <select onChange={handleChainChange}>
        {chainOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
};
