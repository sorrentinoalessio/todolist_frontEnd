import activityRepository from "../repository/ActivityRepository.js";
import mailService from "./mailService.js";
import UserRepository from "../repository/UserRepository.js";

export class SchedulerService {
    jobs = [];
    jobData = {};

    async getJob() {

        const activities = await activityRepository.getIdsStatusOpen();
        for (const id_user of activities) {
            const users = await UserRepository.getManyByUserOwnerId(id_user.ownerId);
            if (!users || users.length === 0) continue;
            const user = users[0];
            const idString = id_user._id.toString();
            this.jobs.push(idString);
            this.jobData[idString] = {
                name: user.name,
                email: user.email
            };

        }
    }
    async exec() {
        const activitiesOverdue = {};
        const activities = await activityRepository.getManyByIds(this.jobs);
        activities.forEach(activity => {
            if (new Date().getTime() > activity.dueDate.getTime()) {

                if (!activitiesOverdue[this.jobData[activity._id].email]) {
                    activitiesOverdue[this.jobData[activity._id].email] = [];
                }
                activitiesOverdue[this.jobData[activity._id].email].push({
                    name: activity.name,
                    activityId: activity._id.toString()
                })

            }
        })

        for (const key in activitiesOverdue) {
            await mailService.sendActivityOverdueMail(key, activitiesOverdue[key])
        }
    }
    async start() {
        //await this.exec(); // esegue subito
        setInterval(async () => {
            await this.getJob();
            await this.exec();
        }, 1000 * 60 * 60 * 24);
        // poi ogni 24h
    }

}



