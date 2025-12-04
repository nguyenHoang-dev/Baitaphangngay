import { Router } from 'express';
import { getStudents, createStudent, updateStudent, deleteStudent, getStudentsByClass } from '../controllers/userController';

const router = Router();

router.get('/', getStudents);
router.post('/', createStudent);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);
router.get('/class/:classId', getStudentsByClass);

export default router;
