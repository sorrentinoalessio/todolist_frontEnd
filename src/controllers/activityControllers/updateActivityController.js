import { updateActivityById } from '../../services/activityService.js';

export const update = async (req, res) => {
    try{
 const activity = await updateActivityById(req.params.id, req.body, req.userId);
 res.status(200).json(activity);
    }
     catch(err) {
        res.status(err.status).json({message: err.message});
     }
    }
 