import { deleteActivityById } from '../../services/activityService.js';

export const remove = async (req, res) => {
    await deleteActivityById(req.params.id, req.userId).catch(err => {
        return res.status(500).json()
    });
    return res.status(200).json();
}
