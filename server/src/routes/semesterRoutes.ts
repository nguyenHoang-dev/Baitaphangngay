import { Router } from 'express';
import { getSemesters, createSemester, setCurrentSemester } from '../controllers/semesterController';

const router = Router();

router.get('/', getSemesters);
router.post('/', createSemester);
router.put('/:id/current', setCurrentSemester);

export default router;
