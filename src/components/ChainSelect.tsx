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
    <div
      style={{
        display: "inline-block",
        minWidth: 200,
        padding: 12,
        borderRadius: 8,
        background: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <select
        onChange={handleChainChange}
        style={{
          width: "100%",
          padding: "10px 14px",
          borderRadius: 4,
          border: "1px solid #c4c4c4",
          fontSize: 16,
          background: "#fafafa",
          color: "#333",
          outline: "none",
          transition: "border-color 0.2s",
          boxSizing: "border-box",
        }}
      >
        {chainOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
};
