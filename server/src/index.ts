import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import classRoutes from './routes/classRoutes';
import semesterRoutes from './routes/semesterRoutes';
import activityRoutes from './routes/activityRoutes';
import participationRoutes from './routes/participationRoutes';
import scoreRoutes from './routes/scoreRoutes';
import { setupDatabase } from './controllers/setupController';

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/semesters', semesterRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/participations', participationRoutes);
app.use('/api/scores', scoreRoutes);
app.get('/api/setup', setupDatabase);

app.get('/', (req, res) => {
    res.send('Student Training Point Management System API');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
