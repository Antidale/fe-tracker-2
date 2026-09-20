import { GrpcWebFetchTransport } from "@protobuf-ts/grpcweb-transport"
import { DeviceInfoClient, DeviceMemoryClient, DevicesClient } from "./sni-generated/sni.client"

const getTransport = (host: string, port: number) => {
    return new GrpcWebFetchTransport({
        baseUrl: `http://${host}:${port}`,
    })
}

function getMemoryClient(host: string, port: number) {
    return new DeviceMemoryClient(getTransport(host, port))
}

function getDeviceClient(host: string, port: number) {
    return new DevicesClient(getTransport(host, port))
}

function getDeiceInfoClient(host: string, port: number) {
    return new DeviceInfoClient(getTransport(host, port))
}

export { getMemoryClient, getDeviceClient, getDeiceInfoClient }