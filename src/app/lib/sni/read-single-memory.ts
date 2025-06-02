import { AddressSpace, MemoryMapping } from "@/app/lib/sni/sni-generated/sni"
import { DeviceMemoryClient } from "@/app/lib/sni/sni-generated/sni.client"
import { MemoryAddress } from "./sni-interfaces"

export async function performSingleRead(client: DeviceMemoryClient, uri: string, addressSpace: AddressSpace, memoryAddress: MemoryAddress, overrideLength?: number) {
    const readResult = await client.singleRead({
        uri: uri,
        request: {
            requestMemoryMapping: MemoryMapping.Unknown,
            size: overrideLength ?? memoryAddress.size,
            requestAddressSpace: addressSpace,
            requestAddress: memoryAddress.address
        }
    })

    return readResult
}