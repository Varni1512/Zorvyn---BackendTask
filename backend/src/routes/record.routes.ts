import express from 'express';
import { getRecords, createRecord, updateRecord, deleteRecord } from '../controllers/record.controller';
import { protect, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createRecordSchema, updateRecordSchema } from '../schemas/record.schema';
import { UserRole } from '../models/User';

const router = express.Router();

router.use(protect); // All routes require authentication

router.get('/', getRecords);
router.post('/', authorize(UserRole.ADMIN), validate(createRecordSchema), createRecord);
router.put('/:id', authorize(UserRole.ADMIN), validate(updateRecordSchema), updateRecord);
router.delete('/:id', authorize(UserRole.ADMIN), deleteRecord);

export default router;
