import React from "react";
import { useSearchParams } from "react-router-dom";
import type { ExtendedNft } from "../lib/types/Nft";

const NftDetails: React.FC = () => {
  const [searchParams] = useSearchParams();
  const nftParam = searchParams.get("nft");
  if (!nftParam) {
    return <div>NFT missing in URL params.</div>;
  }

  const nft = JSON.parse(decodeURIComponent(nftParam)) as ExtendedNft;

  return <div>{JSON.stringify(nft, null, 2)}</div>;
};
export default NftDetails;
