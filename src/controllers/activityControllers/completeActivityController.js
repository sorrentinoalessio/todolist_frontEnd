import { completeActivityById } from "../../services/activityService.js";

export const complete = async (req, res) => {
    try {
        const activity = await completeActivityById(req.params.id, req.userId);
        res.status(200).json(activity);
    } catch(err) {
        res.status(err.status).json({message: err.message});
    }
}