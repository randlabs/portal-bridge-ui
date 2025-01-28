import ERC_20 from "../abi/ERC20.json";
import EIP_1967 from "../abi/EIP1967.json"
import { Provider, Contract, keccak256, getAddress, toUtf8Bytes, ZeroAddress } from "ethers";

// EIP-1967 implementation storage slot
const EIP1967_SLOT = BigInt(keccak256(toUtf8Bytes("eip1967.proxy.implementation"))) - BigInt(1);

async function getImplementationAddress(address: string, provider: Provider) {
    // Get the implementation address from the proxy contract's storage
    const storageValue = await provider.getStorage(address, EIP1967_SLOT);
    // Convert to a valid Ethereum address (last 20 bytes)
    const implementation = getAddress(`0x${storageValue.slice(-40)}`);
    if (implementation === ZeroAddress) {
        try {
            const contract = new Contract(address, EIP_1967, provider);
            return await contract.implementation();
        } catch (err: any) {
            return address;
        }
    }
    return implementation;
}

export default async function getContract(address: string, provider: Provider) {
    try {
        const instance = new Contract(address, ERC_20, provider);
        await instance.symbol();
        return instance;
    } catch {
        // instance does not have symbol method, try like a proxy
        const implementation = await getImplementationAddress(address, provider);
        return new Contract(implementation, ERC_20, provider);
    }
}