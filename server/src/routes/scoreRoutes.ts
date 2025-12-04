import { Router } from 'express';
import { calculateScore, getStudentScore } from '../controllers/scoreController';

const router = Router();

router.post('/calculate', calculateScore);
router.get('/', getStudentScore);

export default router;
