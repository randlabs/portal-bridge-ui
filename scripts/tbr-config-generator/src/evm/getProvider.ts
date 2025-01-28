import "dotenv/config";
import { EvmChains } from "@wormhole-foundation/sdk-evm";
import { Provider, JsonRpcProvider } from "ethers";

const DEFAULT_RPCS: Record<string, string> = {
    Ethereum: "https://ethereum-rpc.publicnode.com",
    Polygon: "https://polygon-bor-rpc.publicnode.com",
    Bsc: "https://bsc-rpc.publicnode.com",
    Avalanche: "https://avalanche-c-chain-rpc.publicnode.com",
    Fantom: "https://fantom-rpc.publicnode.com",
    Celo: "https://celo-rpc.publicnode.com",
    Arbitrum: "https://arbitrum-one-rpc.publicnode.com",
    Optimism: "https://optimism-rpc.publicnode.com",
    Base: "https://base-rpc.publicnode.com",
};

const CACHE = new Map<EvmChains, Provider>();

function getRpcHost(chain: string): string | undefined {
    const envNameKey = chain.toUpperCase() + '_RPC';
    return process.env[envNameKey] || DEFAULT_RPCS[chain];
}

export default function getProvider(chain: EvmChains): Provider {
    if (CACHE.has(chain)) {
        return CACHE.get(chain)!;
    } else {
        const rpc = getRpcHost(chain);
        const provider = new JsonRpcProvider(rpc);
        CACHE.set(chain, provider);
        return provider;
    }
}
