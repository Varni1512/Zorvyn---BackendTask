import express from 'express';
import { getDashboardSummary } from '../controllers/dashboard.controller';
import { protect } from '../middlewares/auth.middleware';

const router = express.Router();

router.use(protect);

router.get('/', getDashboardSummary);

export default router;
