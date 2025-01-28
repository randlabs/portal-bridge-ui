#!/usr/bin/env tsx
import { EvmChains } from "@wormhole-foundation/sdk-evm";
import { writeFileSync } from "node:fs";
import { parseArgs } from "node:util";

const args = process.argv.slice(2);

const { values, positionals } = parseArgs({
    args,
    options: {
        help: {
            type: 'boolean',
            short: 'h'
        },
        queries: {
            type: 'string'
        },
    },
    allowPositionals: true
});

function printHelp() {
    console.log(`
Usage: index.mts [options]
Options:
    -h, --help              Print this help message
    --queries               The queries to run with the format [Chain Name]:[Query Id]
    `);
}

if (values.help) {
    printHelp();
    process.exit(0);
}

function parseInput(input: string) {
    const query = input.split(":");
    const queryIdStr = query.pop()!;
    const chain = query.pop()! as EvmChains;
    return {
        queryIdStr,
        chain
    }
}

async function executeCreateConfigFromDuneQuery() {
    const { default: createConfig } = await import("../src/config/createConfig");
    const output = positionals.pop() || "output.json";
    const inputs = values.queries?.split(',') || [];
    const result = [];
    for (const input of inputs) {
        const { queryIdStr, chain } = parseInput(input);
        const chainConfig = await createConfig(queryIdStr, chain);
        result.push(chainConfig);
        writeFileSync(
            output,
            JSON.stringify(result, (_, value) => typeof value === 'bigint' ? value.toString() : value, 2),
            'utf-8'
        );
    }
    writeFileSync(
        output,
        JSON.stringify(result, (_, value) => typeof value === 'bigint' ? value.toString() : value, 2),
        'utf-8'
    );
}

if (values.queries) {
    console.log(`Running queries ${values.queries}`);
    executeCreateConfigFromDuneQuery();
}