import { getDeviceClient } from "./get-client";

export async function connectSni(host: string, port: number, attempts = 0) {
    if (attempts === 5)
        return Promise.reject(new Error("exceeded retry attempts"));

    attempts += 1;

    try {
        const client = getDeviceClient(host, port);

        const listedDevices = await client.listDevices({ kinds: [] });

        switch (listedDevices.response.devices.length) {
            case 0: {
                return await connectSni(host, port, attempts)
            }
            //TODO: Eventually can not default to the first connected device.
            //I do not know if any FE players will actually have multiple to choose from
            default: return Promise.resolve(listedDevices.response.devices[0]);
        }

    } catch {
        return await connectSni(host, port, attempts)
    }
}