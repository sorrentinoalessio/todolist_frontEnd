import { openActivityById } from "../../services/activityService.js";

export const open = async (req, res) => {
    try {
        const activity = await openActivityById(req.params.id, req.userId);
        res.status(200).json(activity);
    } catch(err) {
        res.status(err.status).json({message: err.message});
    }
}