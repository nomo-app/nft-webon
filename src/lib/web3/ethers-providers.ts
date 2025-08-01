import { ethers } from 'ethers';
import { zscProvider } from 'ethersjs-nomo-webons';
import type { NomoEvmNetwork } from 'nomo-webon-kit';


export function getEthersProvider(network: NomoEvmNetwork): ethers.AbstractProvider {
	if (network === 'zeniq-smart-chain') {
		return zscProvider;
	} else if (network === 'ethereum') {
		return ethers.getDefaultProvider();
	} else if (network === 'polygon') {
		return new ethers.JsonRpcProvider('https://polygon-rpc.com', {
			name: 'polygon',
			chainId: 137
		});
	} else {
		throw new Error(`Unimplemented network: ${network}`);
	}
}
