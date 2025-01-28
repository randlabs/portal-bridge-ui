import 'dotenv/config';
import { DuneClient } from "@duneanalytics/client-sdk";
import { Chain, ChainId, chainIdToChain } from '@wormhole-foundation/sdk';

const client = new DuneClient(process.env.DUNE_API_KEY!);

function extractAnchorText(html: string) {
    const anchorTextRegex = /<a\b[^>]*>(.*?)<\/a>/i;
    const match = anchorTextRegex.exec(html);
    return match ? match[1].trim() : "";
}

function getTokenAddress(row: any): string {
    return extractAnchorText(row["Token Address"] as string);
}

function getTokenChain(row: any): Chain {
    const chainId = parseInt(row["Token Chain"]) as ChainId;
    const chain = chainIdToChain(chainId);
    return chain;
}


function getEnvVar<T>(key: string, defaultValue: string, map = (input: string): T => input as T) {
    return map(process.env[key] || defaultValue);
}

function parseBool(input: string): boolean {
    return Boolean(input);
}


type DuneInfo = { address: string, sourceChain: Chain }

export default async function getDuneInfo(queryIdStr: string): Promise<DuneInfo[]> {
    const queryId = parseInt(queryIdStr);
    const execute = getEnvVar('DUNE_QUERY_EXECUTE', 'false', parseBool);
    const offset = getEnvVar('DUNE_QUERY_OFFSET', '0', parseInt);
    const limit = getEnvVar('DUNE_QUERY_LIMIT', '30', parseInt);    
    const params = { queryId, limit, offset };
    const response = execute ? await client.runQuery(params) : await client.getLatestResult(params);
    if (response.result) {
        return response.result.rows.map(row => ({
            address: getTokenAddress(row),
            sourceChain: getTokenChain(row),
            transfers: row['Transfers Sent']
        }));    
    } else {
        return [];
    }
}