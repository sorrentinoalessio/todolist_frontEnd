import NotFoundException from '../exceptions/NotFoundException.js';
import activityRepo from '../repository/ActivityRepository.js';
import { activityStatus, userStatus } from '../constants/const.js';


export const addActivity = async (content, userId) => {
    content.ownerId = userId;
    return await activityRepo.add(content).catch((err) => {
        return null;
    });
}

export const getActivityById = async (id, userId) => {
    return await activityRepo.getById(id, userId);
}

export const updateActivityById = async (id, params, userId) => {
    const activity = await activityRepo.update(id, params, userId);
    if (!activity) {
        throw new NotFoundException(`error: activity ${id} not found`)
    }
    return activity;
}

export const deleteActivityById = async (id, userId) => {
    await activityRepo.update(id, { status: activityStatus.DELETED }, userId);
}

export const getActivities = async (userId, status) => {
    return await activityRepo.getManyByUserId(userId, status);
}

export const completeActivityById = async (id, userId) => {
    const activity = await activityRepo.complete(id, userId);
    if (!activity) {
        throw new NotFoundException(`error: activity ${id} not found`)
    }
    return activity;
}
export const openActivityById = async (id, userId) => {
    const activity = await activityRepo.open(id, userId);
    if (!activity) {
        throw new NotFoundException(`error: activity ${id} not found`)
    }
    return activity;
}
export const archivedActivityById = async (id, userId) => {
    const activity = await activityRepo.archived(id, userId);
    if (!activity) {
        throw new NotFoundException(`error: activity ${id} not found`)
    }
    return activity;
}

/* 
export const removeActivityById = async(id) => {
    return await new Promise((resolve, reject) => {
        const readlineInterface = readline.createInterface({
            input: fs.createReadStream(dbFile),
            crlfDelay: Infinity
        });
        const activities = [];
        readlineInterface.on('line', (line) => {
            const activity = JSON.parse(line);
            if(activity.id != id) {
                activities.push(JSON.stringify(activity) + '\n');
            }
        });
        readlineInterface.on('close', () => {
            fs.writeFile(dbFile, activities.join(''), (err) => {
                if (err) {
                    reject(null);
                }
            resolve({id})
            });
        })
    })
}
*/