import { AddressSpace } from "@/app/sni/sni";
import { DeviceMemoryClient } from "@/app/sni/sni.client";
import { GrpcWebFetchTransport } from "@protobuf-ts/grpcweb-transport";
import { memoryAddresses, MemoryAddressName } from "../default-data";
import { performSingleRead } from "./read-single-memory";


//todo: move to somewhere else
const getTransport = (port: string, host: string) => {
    return new GrpcWebFetchTransport({
        baseUrl: `http://${host}:${port}`,
    })
}

//todo: if we need this anywhere else, also move to another file/utils section
function convert(input: Uint8Array<ArrayBufferLike>) {
    const length = input.length;
    const buff = Buffer.from(input);
    const result = buff.readUIntLE(0, length)
    return result;
}

export async function readMetadata(uri: string | undefined, addressSpace: AddressSpace | undefined, port: string, host: string) {
    if (!uri) { return {} }

    if (addressSpace === undefined) {
        addressSpace = AddressSpace.FxPakPro
    }

    const transport = getTransport(port, host);
    const memoryClient = new DeviceMemoryClient(transport);
    const docLengthResponse = await performSingleRead(
        memoryClient,
        uri,
        addressSpace,
        memoryAddresses[MemoryAddressName.MetadataLength]
    );

    if (!docLengthResponse.response.response) {
        return {}
    }

    const docLength = convert(docLengthResponse.response.response.data);

    const documentResponse = await performSingleRead(memoryClient, uri, addressSpace, memoryAddresses[MemoryAddressName.MetadataDocument], docLength);

    const metadataDocumentString = new TextDecoder("utf-8").decode(documentResponse.response.response?.data);

    return JSON.parse(metadataDocumentString);
}