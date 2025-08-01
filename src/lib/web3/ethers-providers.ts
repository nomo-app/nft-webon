import { ethers } from 'ethers';
import { zscProvider } from 'ethersjs-nomo-webons';
import { nomo, type NomoEvmNetwork } from 'nomo-webon-kit';
import { ethNetwork, RotatingRpcProvider, rpcUrlsEthereumMainnet } from './rotating-rpc-provider';

export async function getEvmAddress() {
	// return '0x799021D2fdd2daAE79d61b66012ada83db2Be428';
	return await nomo.getEvmAddress();
}

const ethProviderInstance = new RotatingRpcProvider(rpcUrlsEthereumMainnet, ethNetwork);

const polygonNetwork = new ethers.Network('polygon', 137n);
const rpcUrlsPolygon = [
	//'https://rpc.ankr.com/polygon',
	'https://polygon-rpc.com',
	'https://matic-mainnet.chainstacklabs.com'
];

export const polygonProviderInstance = new RotatingRpcProvider(rpcUrlsPolygon, polygonNetwork);

export function getEthersProvider(network: NomoEvmNetwork): ethers.AbstractProvider {
	if (network === 'zeniq-smart-chain') {
		return zscProvider;
	} else if (network === 'ethereum') {
		return ethProviderInstance;
	} else if (network === 'polygon') {
		return new ethers.JsonRpcProvider('https://polygon-rpc.com', {
			name: 'polygon',
			chainId: 137
		});
	} else {
		throw new Error(`Unimplemented network: ${network}`);
	}
}
