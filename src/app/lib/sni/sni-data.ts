import { MemoryAddress } from "./sni-interfaces";


enum MemoryAddressName {
    MetadataLength = "metadataLength",
    MetadataDocument = "metadataDocument",
    FoundKeyItems = "foundKeyItems",
    UsedKeyItems = "usedKeyItems",
    CompletedObjectives = "completedObjectives"
}

const memoryAddresses: Record<MemoryAddressName, MemoryAddress> = {
    metadataLength: { size: 4, address: 0x1FF000 },
    metadataDocument: { size: 0, address: 0x1FF004 },
    foundKeyItems: { size: 3, address: 0xF51500 },
    usedKeyItems: { size: 3, address: 0xF51503 },
    //This one I haven't actually done/verified yet
    completedObjectives: { size: 32, address: 0xF51520 },
}

export { memoryAddresses, MemoryAddressName }