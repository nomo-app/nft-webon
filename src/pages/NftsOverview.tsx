import React from "react";
import { useGlobalState } from "../components/use-global-state";
import { ChainSelect } from "../components/ChainSelect";
import { useNavigate } from "react-router-dom";
import { nftDetailsRoute } from "../routes";
import type { ExtendedNft } from "../lib/types/Nft";

const NftsOverview: React.FC = () => {
  return (
    <div>
      <h1>NFTs</h1>
      <ChainSelect />
      <NftGrid />
      <div className="card"></div>
    </div>
  );
};
export default NftsOverview;

const NftGrid: React.FC = () => {
  const { state } = useGlobalState();
  const navigate = useNavigate();
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

  const handleClick = (nft: ExtendedNft) => {
    const route = nftDetailsRoute({ nft });
    navigate(route);
  };

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
          onClick={() => handleClick(nft)}
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
