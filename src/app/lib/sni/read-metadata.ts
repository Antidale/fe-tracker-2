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

async function readMetadataDoc(client: DeviceMemoryClient, uri: string, addressSpace: AddressSpace, docLength: number) {
    const stuff = await client.singleRead({
        uri: uri,
        request: {
            requestMemoryMapping: MemoryMapping.Unknown,
            size: docLength,
            requestAddressSpace: addressSpace,
            requestAddress: memoryAddresses[MemoryAddressName.MetadataDocument].address
        }
    })

    return stuff.response;
}

function convert(input: Uint8Array<ArrayBufferLike>) {
    const length = input.length;
    const buff = Buffer.from(input);
    const result = buff.readUIntLE(0, length)
    return result;
}

export async function readMetadata(uri: string | undefined, addressSpace: AddressSpace | undefined, port: string, host: string) {
    if (!uri) { return "" }

    if (addressSpace === undefined) {
        addressSpace = AddressSpace.FxPakPro
    }

    const transport = getTransport(port, host);
    const thingy = new DeviceMemoryClient(transport);
    const stuff = await readMetadataDocLength(thingy, uri, addressSpace);
    if (!stuff.response) {
        return ""
    }

    const junk = convert(stuff.response.data);

    const documentResponse = await readMetadataDoc(thingy, uri, addressSpace, junk);

    const blargh = new TextDecoder("utf-8").decode(documentResponse.response?.data)

    return JSON.parse(blargh)
}