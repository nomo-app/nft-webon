import React from "react";
import { useGlobalState } from "./use-global-state";
import { ChainSelect } from "./ChainSelect";

export const NftsOverview: React.FC = () => {
  return (
    <div>
      <h1>NFTs</h1>
      <ChainSelect />
      <NftGrid />
      <div className="card"></div>
    </div>
  );
};

const NftGrid: React.FC = () => {
  const { state } = useGlobalState();
  const nfts = state.nfts;

  if (state.fetchError) {
    return <div>Error fetching NFTs: {state.fetchError}</div>;
  }
  if (!nfts) {
    return <div>Loading NFTs...</div>;
  }
  if (nfts.length === 0) {
    return <div>No NFTs found for the selected chain.</div>;
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: "16px",
      }}
    >
      {nfts.map((nft) => (
        <div
          key={nft.baseNFT.symbol}
          style={{
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            padding: "16px",
            background: "#fafafa",
            boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
          }}
        >
          <p style={{ fontWeight: "bold", marginBottom: "8px" }}>
            {nft.baseNFT.name}
          </p>
          <p style={{ fontSize: "12px", color: "#888", marginBottom: "8px" }}>
            {nft.baseNFT.contractAddress}
          </p>
          <p>{"Count: " + nft.baseNFT.balance}</p>
        </div>
      ))}
    </div>
  );
};
