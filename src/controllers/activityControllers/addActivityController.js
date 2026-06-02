
import { addActivity } from '../../services/activityService.js';

export const add = async (req, res) => {
    const content = req.body;
    try {
        const activity = await addActivity(content, req.userId);
        res.status(201).json(activity);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
