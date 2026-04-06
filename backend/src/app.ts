import express from 'express';
import cors from 'cors';
import 'express-async-errors'; // Handles async errors without wrapping routes in try-catch
import { errorHandler, notFound } from './middlewares/error.middleware';

import authRoutes from './routes/auth.routes';
import recordRoutes from './routes/record.routes';
import dashboardRoutes from './routes/dashboard.routes';
import userRoutes from './routes/user.routes';

const app = express();

app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
