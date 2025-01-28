import "dotenv/config";
import { Chain, Network, TokenAddress, TokenId, isNetwork, wormhole } from "@wormhole-foundation/sdk";
import solana from "@wormhole-foundation/sdk/solana";
import evm from "@wormhole-foundation/sdk/evm";
import sui from "@wormhole-foundation/sdk/sui";
import aptos from "@wormhole-foundation/sdk/aptos";
import algorand from "@wormhole-foundation/sdk/algorand";
import cosmwasm from "@wormhole-foundation/sdk/cosmwasm";

function getNetwork(): Network {
    return isNetwork(process.env.NETWORK!) ? process.env.NETWORK : "Mainnet";
}

export default async function getWrappedAssetForChain(tokenId: TokenId, chain: Chain): Promise<TokenAddress<Chain>|undefined> {
    const wh = await wormhole(getNetwork(), [solana, evm, sui, aptos, algorand, cosmwasm]);
    const context = wh.getChain(chain);
    if (context.supportsTokenBridge()) {
        const tb = await context.getTokenBridge();
        try {
            return tb.getWrappedAsset(tokenId);
        } catch (error: any) {
            console.log('getWrappedAssetForChain:', error.message);
        }
    }
}

export async function getWrappedAsset(tokenId: TokenId, chains: Array<Chain>): Promise<string[][]> {
    const result: string[][] = [];
    for (const chain of chains) {
        const address = await getWrappedAssetForChain(tokenId, chain);
        if (address !== undefined) {
            result.push([chain, address.toString()]);
        }
    }
    return result;
}
