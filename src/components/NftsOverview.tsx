import React from "react";
import { useGlobalState } from "./use-global-state";

export const NftsOverview: React.FC = () => {
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
    <div>
      <ul>
        {nfts.map((nft) => (
          <li key={nft.baseNFT.symbol}>
            <p>{nft.baseNFT.name}</p>
            <p>{nft.baseNFT.contractAddress}</p>
            <p>{"Count: " + nft.baseNFT.balance}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
