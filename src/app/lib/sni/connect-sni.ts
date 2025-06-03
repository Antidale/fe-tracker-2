import { getDeviceClient } from "./get-client";

export async function connectSni(host: string, port: number, attempts = 0) {
    if (attempts === 5)
        return Promise.reject(new Error("exceeded retry attempts"));

    attempts += 1;

    //TODO: figure out errors on very first connection to supernt (and maybe emulators, haven't tried them yet).
    try {
        const client = getDeviceClient(host, port);

        const listedDevices = await client.listDevices({ kinds: [] });

        switch (listedDevices.response.devices.length) {
            case 0: {
                return await connectSni(host, port, attempts)
            }

            //Just give them the first one back, if need be later on we can add something to let them select a device
            default: return Promise.resolve(listedDevices.response.devices[0]);
        }

    } catch {

        return await connectSni(host, port, attempts)
    }
}