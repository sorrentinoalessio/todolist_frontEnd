import AddActivityAction from "../components/actions/AddActivityAction.js";

class OnConnectionMiddleware {
    async onConnection(socket, io, next){
        console.log('connected');
        new AddActivityAction(socket, socket.data.loggedUser).process();
        socket.emit('connected', socket.data.loggedUser);
        next();
    }
}

export default new OnConnectionMiddleware();