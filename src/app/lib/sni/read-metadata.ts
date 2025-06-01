import { AddressSpace, MemoryMapping } from "@/app/sni/sni";
import { DeviceMemoryClient } from "@/app/sni/sni.client";
import { GrpcWebFetchTransport } from "@protobuf-ts/grpcweb-transport";

import { memoryAddresses, MemoryAddressName } from "../default-data";

const getTransport = (port: string, host: string) => {
    return new GrpcWebFetchTransport({
        baseUrl: `http://${host}:${port}`,
    })
}

async function readMetadataDocLength(client: DeviceMemoryClient, uri: string, addressSpace: AddressSpace) {
    const stuff = await client.singleRead({
        uri: uri,
        request: {
            requestMemoryMapping: MemoryMapping.Unknown,
            size: 4,
            requestAddressSpace: addressSpace,
            requestAddress: memoryAddresses[MemoryAddressName.MetadataLength].address
        }
    })

    return stuff.response;
}

export async function readMetadata(uri: string | undefined, addressSpace: AddressSpace | undefined, port: string, host: string) {
    if (!uri) { return "" }

    if (addressSpace === undefined) {
        addressSpace = AddressSpace.FxPakPro
    }

    const transport = getTransport(port, host);
    const thingy = new DeviceMemoryClient(transport);
    const stuff = await readMetadataDocLength(thingy, uri, addressSpace);


    return stuff.response?.data.toString()
}