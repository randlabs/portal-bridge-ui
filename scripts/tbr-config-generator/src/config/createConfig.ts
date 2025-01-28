import { EvmChains } from "@wormhole-foundation/sdk-evm";
import { Chain, MapLevel, RoPair, TokenConst, TokenSymbol, Wormhole } from "@wormhole-foundation/sdk";
import chalk from "chalk";
import getDuneInfo from "../dune/getDuneInfo";
import getTokenDetails from "../token/getTokenDetails";

export default async function createConfig(queryIdStr: string, chain: EvmChains): Promise<MapLevel<Chain, MapLevel<TokenSymbol, TokenConst>>> {
    console.log(chalk.green(`Creating configs for ${chain} using query ${queryIdStr}`));
    const duneResult = await getDuneInfo(queryIdStr);
    console.table(duneResult);
    const result: RoPair<TokenSymbol, TokenConst>[] = [];
    for (const { address, sourceChain} of duneResult) {
        try {
            const tokenId = Wormhole.tokenId(sourceChain, address);
            const details = await getTokenDetails(tokenId, chain, sourceChain);
            if (details) {
                const entry = [
                    details.symbol,
                    details
                ] satisfies RoPair<TokenSymbol, TokenConst>;
                result.push(entry);
            } else {
                console.log(chalk.red(`Unable to get config for ${tokenId}`));
            }
        } catch (err: unknown) {
            console.log(chalk.red(`Unable to process ${address} at ${sourceChain}`))
        }
    }
    const config = [
        chain as Chain,
        result as MapLevel<TokenSymbol, TokenConst>
    ] as unknown as MapLevel<Chain, MapLevel<TokenSymbol, TokenConst>>
    return config;
}