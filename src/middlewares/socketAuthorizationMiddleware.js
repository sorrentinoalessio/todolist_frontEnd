import UnauthorizedException from '../exceptions/UnauthorizedException.js';
import jwtUtils from '../utils/CryptoUtils.js';

export default (socket, next) => {
    const token = socket.handshake.auth.accessToken ?? socket.handshake.query.accessToken;

    try {
        const loggedUser = jwtUtils.verifyJwt(token);
        if (loggedUser?.userId) {
            socket.data.loggedUser = loggedUser;
            return next(); // ← return qui per non continuare
        }
        return next(new UnauthorizedException('Unauthorized1: ' + token));
    } catch (err) {
        return next(new UnauthorizedException('Unauthorized2: ' + token));
    }
}

