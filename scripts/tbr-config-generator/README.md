# tbr-config-generator

## Dune Query Ids

- Ethereum:  4126080
- Polygon:   4128580
- BNB Chain: 4128575
- Avalanche: 4137843
- Fantom:    4137974
- Celo:      4137984
- Arbitrum:  4138031
- Optimism:  4140347
- Base:      4140404

## Config Generation

```bash
npm exec tbr-configs -- --queries Ethereum:4126080,Polygon:4128580,Bsc:4128575,Avalanche:4137843,Fantom:4137974,Celo:4137984,Arbitrum:4138031,Optimism:4140347,Base:4140404
```

## Environment options

```bash
NETWORK            = Mainnet|Testnet
DUNE_API_KEY       = <API-Key>
DUNE_QUERY_EXECUTE = true|false
DUNE_QUERY_OFFSET  = result offset, default 0
DUNE_QUERY_LIMIT   = result limit, default 30
[CHAIN]_RPC        = Chain rpc specific
```
