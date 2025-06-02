import { AddressSpace, MemoryMapping } from "@/app/sni/sni"
import { DeviceMemoryClient } from "@/app/sni/sni.client"
import { MemoryAddress } from "../interfaces"

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