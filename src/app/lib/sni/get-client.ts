import { GrpcWebFetchTransport } from "@protobuf-ts/grpcweb-transport"
import { DeviceMemoryClient, DevicesClient } from "./sni-generated/sni.client"

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

export { getMemoryClient, getDeviceClient }