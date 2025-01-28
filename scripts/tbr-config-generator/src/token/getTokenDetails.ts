import { EvmChains } from "@wormhole-foundation/sdk-evm";
import { Chain, TokenConst, TokenId } from "@wormhole-foundation/sdk";
import chalk from "chalk";
import getProvider from "../evm/getProvider";
import getContract from "../evm/getContract";
import getWrappedAssetForChain from "./getWrappedAssetForChain";

export async function getContractInfo(address: string, chain: EvmChains, original: Chain = chain): Promise<TokenConst|null> {
    try {
        const provider = getProvider(chain);
        const contract = await getContract(address, provider);
        const symbol = await contract.symbol();
        const decimals = await contract.decimals();
        if (symbol === "") {
            console.log(chalk.yellow(`Symbol is empty for ${address} at ${chain}`))
        }
        return {
            address,
            symbol,
            decimals,
            original
        } as const satisfies TokenConst;
    } catch (err: any) {
        console.log(chalk.red(`Unable to get on chain info for ${address}`), err.message)
        return null;
    }
}

async function getTokenAddress(tokenId: TokenId<Chain>, queryChain: EvmChains, sourceChain: Chain): Promise<string> {
    if (sourceChain !== queryChain) {
        const wrapped = await getWrappedAssetForChain(tokenId, queryChain);
        if (wrapped) {
            return wrapped.toString();
        }
        console.log(chalk.red(`Wrapped address does not exist for ${tokenId}, returning original address`))
    }
    return tokenId.address.toString();
}


export default async function getTokenDetails(tokenId: TokenId<Chain>, queryChain: EvmChains, sourceChain: Chain): Promise<TokenConst|null> {
    const tokenAddress = await getTokenAddress(tokenId, queryChain, sourceChain);
    return getContractInfo(tokenAddress, queryChain, sourceChain);
}