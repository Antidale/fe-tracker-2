import { DevicesResponse_Device } from "@/app/lib/sni/sni-generated/sni";
import { memoryAddresses, MemoryAddressName } from "./sni-data";
import { performSingleRead } from "./read-single-memory";
import { getMemoryClient } from "./get-client";

//todo: if we need this anywhere else, also move to another file/utils section
function convert(input: Uint8Array<ArrayBufferLike>) {
    const length = input.length;
    const buff = Buffer.from(input);
    const result = buff.readUIntLE(0, length)
    return result;
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function readMetadata(device: DevicesResponse_Device | undefined, host: string, port: number) {
    if (!device) { return {} }

    const addressSpace = device.defaultAddressSpace
    const memoryClient = getMemoryClient(host, port)

    //I think this fixes the issues with a brand new connection and getting an error. 
    //it did not :(
    await delay(10);
    const docLengthResponse = await performSingleRead(
        memoryClient,
        device.uri,
        addressSpace,
        memoryAddresses[MemoryAddressName.MetadataLength]
    );

    if (!docLengthResponse.response.response) {
        return {}
    }

    const docLength = convert(docLengthResponse.response.response.data);

    const documentResponse = await performSingleRead(memoryClient, device.uri, addressSpace, memoryAddresses[MemoryAddressName.MetadataDocument], docLength);

    const metadataDocumentString = new TextDecoder("utf-8").decode(documentResponse.response.response?.data);

    return JSON.parse(metadataDocumentString);
}