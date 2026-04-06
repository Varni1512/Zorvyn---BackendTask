import express from 'express';
import { getRecords, createRecord, updateRecord, deleteRecord } from '../controllers/record.controller';
import { protect, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createRecordSchema, updateRecordSchema } from '../schemas/record.schema';
import { UserRole } from '../models/User';

const router = express.Router();

router.use(protect); // All routes require authentication

router.get('/', getRecords);
router.post('/', validate(createRecordSchema), createRecord);
router.put('/:id', validate(updateRecordSchema), updateRecord);
router.delete('/:id', deleteRecord);

export default router;
