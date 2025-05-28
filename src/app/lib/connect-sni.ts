import { GrpcWebFetchTransport } from "@protobuf-ts/grpcweb-transport";
import { DevicesClient } from "../sni/sni.client";

export async function connectSni(portStr: string) {
    const portInt = parseInt(portStr);
    if (isNaN(portInt)) {
        console.error(`sni port ${portStr} turned to NaN`)
        return 0
    }

    try {
        const channel = new GrpcWebFetchTransport(({ baseUrl: `http://localhost:${portInt}` }));
        const devicesClient = new DevicesClient(channel);
        const listedDevices = await devicesClient.listDevices({ kinds: [] });
        return listedDevices.response.devices.length;
    } catch {
        console.error("exploded getting devices")
        return 0;
    }
}