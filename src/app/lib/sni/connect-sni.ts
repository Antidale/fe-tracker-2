import { GrpcWebFetchTransport } from "@protobuf-ts/grpcweb-transport";
import { DevicesClient } from "../../sni/sni.client";


export async function connectSni(portStr: string, host = "localhost", attempts = 0) {
    const portInt = parseInt(portStr);
    if (isNaN(portInt)) {
        console.error()
        return Promise.reject(new Error(`sni port ${portStr} turned to NaN`));
    }

    if (attempts === 5)
        return Promise.reject(new Error("exceeded retry attempts"));

    attempts += 1;

    try {
        const channel = new GrpcWebFetchTransport(({ baseUrl: `http://${host}:${portInt}` }));
        const devicesClient = new DevicesClient(channel);
        const listedDevices = await devicesClient.listDevices({ kinds: [] });
        switch (listedDevices.response.devices.length) {
            //it's possible that something just isn't running quite yet. This, and the catch block, are some shots in the dark. Still probably need/want a reconnect button if things ever get disconnected.
            case 0: return await connectSni(portStr, host, attempts)

            //Just give them the first one back, if need be later on we can add something to let them select a device
            default: return Promise.resolve(listedDevices.response.devices[0]);
        }

    } catch {
        return await connectSni(portStr, host, attempts)
    }
}