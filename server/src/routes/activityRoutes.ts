import { Router } from 'express';
import { getActivities, createActivity, deleteActivity, updateActivity } from '../controllers/activityController';

const router = Router();

router.get('/', getActivities);
router.post('/', createActivity);
router.put('/:id', updateActivity);
router.delete('/:id', deleteActivity);

export default router;
