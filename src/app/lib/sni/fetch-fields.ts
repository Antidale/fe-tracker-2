import { DevicesResponse_Device, FieldsRequest, Field } from "./sni-generated/sni";
import { getDeiceInfoClient } from "./get-client";

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function fetchFields(device: DevicesResponse_Device | undefined, host: string, port: number): Promise<string> {
    if (!device) { return "" }
    const uri = device.uri;
    const infoClient = getDeiceInfoClient(host, port);

    try {
        //This is something that can be expanded on to pull more fields back. Right now for demonstrating the capability, I'm just pulling the file name.
        for (let attempt = 0; attempt < 10; attempt++) {
            const request = FieldsRequest.create({
                uri,
                fields: [Field.RomFileName]
            })
            const call = await infoClient.fetchFields(request)
            const fileName = call.response.values[0] ?? "";
            return fileName
        }
    }
    catch {
        await delay(30)
    }
    return "";
}