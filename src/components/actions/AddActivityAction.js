import { actions } from "../../constants/const.js";
import { addActivity } from '../../services/activityService.js';
import addActivityValidator from "../../validators/actions/AddActivityValidator.js";


class AddActivityAction {
    #socket = null;
    #user = null;

    constructor(socket, user) {
        this.#socket = socket;
        this.#user = user;
    }

    process() {
        this.#socket.on(actions.ADD_ACTIVITY, async (data, ack) => {
            try {
                data = addActivityValidator.validate(data);
                const activity = await addActivity(data, this.#user.userId);
                ack({
                    result: {
                        success: true,
                        data: activity
                    }
                })
            }

            catch (err) {
                ack({
                    result: {
                        success: false,
                        error: err.message.toString()
                    }
                })
            }
            return;
        })
    }
}

export default AddActivityAction;