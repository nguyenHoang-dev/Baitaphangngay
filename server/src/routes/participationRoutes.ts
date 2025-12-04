import { Router } from 'express';
import { registerActivity, getStudentParticipations, updateParticipationStatus, getAllParticipations } from '../controllers/participationController';

const router = Router();

router.post('/', registerActivity);
router.get('/', getAllParticipations);
router.get('/student/:studentId', getStudentParticipations);
router.put('/:id/status', updateParticipationStatus);

export default router;
