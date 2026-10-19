import express from 'express';
import * as notificationController from '../controllers/notificationController.js';
import { authorizeRoles } from '../middleware/auth.js';
const router = express.Router();

router.get('/', authorizeRoles('user', 'admin'), notificationController.getNotification);
router.patch('/read-all', authorizeRoles('user', 'admin'), notificationController.markAllAsRead);
router.patch('/:id/read', authorizeRoles('user', 'admin'), notificationController.markAsRead);

export default router;
