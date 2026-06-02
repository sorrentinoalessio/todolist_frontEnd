import { archivedActivityById } from "../../services/activityService.js";

export const archived = async (req, res) => {
    try {
        const activity = await archivedActivityById(req.params.id, req.userId);
        res.status(200).json(activity);
    } catch(err) {
        res.status(err.status).json({message: err.message});
    }
}