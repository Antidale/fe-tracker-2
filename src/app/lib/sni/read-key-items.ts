import { DevicesResponse_Device } from "@/app/lib/sni/sni-generated/sni";
import { memoryAddresses, MemoryAddressName } from "./sni-data";
import { performSingleRead } from "./read-single-memory";
import { getMemoryClient } from "./get-client";


//TODO: these two functions are going to be pretty much entirely the same, excep for the MemoryAddress name, so at some point I should make this better. Probably the caller should just pass in the desired memory adddress. Could also instead expose a single GetKeyItems call that returns something like { found: <the found ki>, used: <the used ki> } and make use of the multi memory read.
async function readFoundKeyItems(device: DevicesResponse_Device | undefined, host: string, port: number) {
    if (!device) { return {} }

    const addressSpace = device.defaultAddressSpace;
    const memoryClient = getMemoryClient(host, port);

    const foundKeyItems = await performSingleRead(
        memoryClient,
        device.uri,
        addressSpace,
        memoryAddresses[MemoryAddressName.FoundKeyItems]
    );

    //TODO: actually go through the returned data and provide something more useful to callers, they shouldn't have to translate this byte array to Ki status
    return foundKeyItems.response.response?.data
}

async function readUsedKeyItems(device: DevicesResponse_Device | undefined, host: string, port: number) {
    if (!device) { return {} }

    const addressSpace = device.defaultAddressSpace;
    const memoryClient = getMemoryClient(host, port);

    const foundKeyItems = await performSingleRead(
        memoryClient,
        device.uri,
        addressSpace,
        memoryAddresses[MemoryAddressName.UsedKeyItems]
    );

    //TODO: actually go through the returned data and provide something more useful to callers, they shouldn't have to translate this byte array to Ki status
    return foundKeyItems.response.response?.data
}

export { readFoundKeyItems, readUsedKeyItems } 