import { activityBodyValidator } from '../validators/activityBodyValidator.js'
import { activityIdParamValidator } from '../validators/activityIdParamsValidator.js';
import checkAuthorizationMiddleware from '../middlewares/checkAuthorizationMiddleware.js';

//import { add } from '../controllers/activityControllers/addActivityController.js';
import { get } from '../controllers/activityControllers/getActivityController.js';
import { update } from '../controllers/activityControllers/updateActivityController.js';
import { remove } from '../controllers/activityControllers/deleteActivityController.js';
import { listOpen } from '../controllers/activityControllers/listOpenActivityController.js';
import { listCompleted } from '../controllers/activityControllers/listCompletedActivityController.js'
import { complete } from '../controllers/activityControllers/completeActivityController.js';
import { open } from '../controllers/activityControllers/openActivityController.js'
import { archived } from '../controllers/activityControllers/archivedActivityController.js';

export class ActivityRoutes {
  constructor(router) {
    //router.post('/', checkAuthorizationMiddleware, activityBodyValidator, add);

    router.get('/completed', checkAuthorizationMiddleware, listCompleted);
    router.get('/', checkAuthorizationMiddleware, listOpen);

    router.get('/:id', checkAuthorizationMiddleware, activityIdParamValidator, get);
   
    router.patch('/:id/complete', checkAuthorizationMiddleware, activityIdParamValidator, complete);
    router.patch('/:id/open', checkAuthorizationMiddleware, activityIdParamValidator, open);
    router.patch('/:id/archived', checkAuthorizationMiddleware, activityIdParamValidator, archived);
    router.patch('/:id', checkAuthorizationMiddleware, activityIdParamValidator, activityBodyValidator, update);
    router.delete('/:id', checkAuthorizationMiddleware, activityIdParamValidator, remove);
  }
}


