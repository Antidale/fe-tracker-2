import { GrpcWebFetchTransport } from "@protobuf-ts/grpcweb-transport";
import { DevicesClient } from "./sni-generated/sni.client";



export async function connectSni(portStr: string, host = "localhost", attempts = 0) {
    const portInt = parseInt(portStr);
    if (isNaN(portInt)) {
        console.error(`invalid port given: ${portStr}`)
        return Promise.reject(new Error(`sni port ${portStr} turned to NaN`));
    }

    if (attempts === 5)
        return Promise.reject(new Error("exceeded retry attempts"));

    attempts += 1;

    //TODO: figure out errors on very first connection to supernt (and maybe emulators, haven't tried them yet).
    try {
        const channel = new GrpcWebFetchTransport(({ baseUrl: `http://${host}:${portInt}` }));
        const devicesClient = new DevicesClient(channel);

        const listedDevices = await devicesClient.listDevices({ kinds: [] });

        switch (listedDevices.response.devices.length) {
            case 0: {
                return await connectSni(portStr, host, attempts)
            }

            //Just give them the first one back, if need be later on we can add something to let them select a device
            default: return Promise.resolve(listedDevices.response.devices[0]);
        }

    } catch {

        return await connectSni(portStr, host, attempts)
    }
}