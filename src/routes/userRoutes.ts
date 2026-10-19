import express from 'express';
import * as userController from '../controllers/userController.js';
import { authorizeRoles } from '../middleware/auth.js';
const router = express.Router();

//public
router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);

//protected
router.delete('/:id', authorizeRoles('user', 'admin'), userController.deleteUser);

export default router;
