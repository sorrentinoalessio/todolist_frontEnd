import onConnectionMiddleware from "../middlewares/OnConnectionMiddleware.js";
import socketAuthorizationMiddleware from "../middlewares/socketAuthorizationMiddleware.js";

class SocketIoInitializer {
    constructor(io) {
        io = io.of('todolist');
        io.use(socketAuthorizationMiddleware).use(async (socket, next) => {
            await onConnectionMiddleware.onConnection(socket, io, next);
        });
    }
}

export default SocketIoInitializer;
