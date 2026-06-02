import { add, verifyRegistrationToken } from '../../services/userService.js';
import { loginUser, loginUserPending} from '../../services/userService.js';
import UserNormalaizer from '../../normalizer/userNormalizer.js';

export const addUser = async (req, res) => {
    const content = req.body;
    try {
        const user = await add(content);
        const userNormalizer = await UserNormalaizer.get(user)
        res.status(201).json(userNormalizer);
        
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const confirmRegistration = async (req, res) => {
    const userId = req.params.id;
    const token = req.params.token;
    try {
        const user = await verifyRegistrationToken(userId, token);
        res.status(200).send('Conferma avvenuta. Registrazione completata');
    } catch (err) {
        res.status(err.status).json({ message: err.message });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await loginUser(email, password);
        res.status(200).json(user);
    } catch (err) {
        res.status(err.status).json({ message: err.message });
    }
}
export const loginPending = async (req, res) => {
    const { email, password } = req.body;
    try {
        await loginUserPending(email, password);
        res.status(200).send('Email inviata correttamente');
    } catch (err) {
        res.status(err.status).json({ message: err.message });
    }
}

