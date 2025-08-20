import type { ExtendedNft } from "./lib/types/Nft";


export function nftDetailsRoute(args: { nft: ExtendedNft }) {
  const nftJson = JSON.stringify(args.nft);
  return `/nft-details?nft=${encodeURIComponent(nftJson)}`;
}
