import { GrpcWebFetchTransport } from "@protobuf-ts/grpcweb-transport";
import { DevicesClient } from "../sni/sni.client";

export async function connectSni(portStr: string, host = "localhost", attempts = 0) {
    const portInt = parseInt(portStr);
    if (isNaN(portInt)) {
        console.error(`sni port ${portStr} turned to NaN`)
        return null
    }

    if (attempts === 5)
        return null;

    attempts += 1;

    try {
        const channel = new GrpcWebFetchTransport(({ baseUrl: `http://${host}:${portInt}` }));
        const devicesClient = new DevicesClient(channel);
        const listedDevices = await devicesClient.listDevices({ kinds: [] });
        switch (listedDevices.response.devices.length) {
            //it's possible that something just isn't running quite yet. This, and the catch block, are some shots in the dark. Still probably need/want a reconnect button if things ever get disconnected.
            case 0: return await connectSni(portStr, host, attempts)

            //Just give them the first one back, if need be later on we can add something to let them select a device
            default: return listedDevices.response.devices[0];
        }

    } catch {
        return await connectSni(portStr, host, attempts)
    }
}