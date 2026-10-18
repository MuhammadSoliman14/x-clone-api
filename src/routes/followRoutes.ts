import express from 'express';
import * as followController from '../controllers/followController.js';
import { authorizeRoles } from '../middleware/auth.js';
const router = express.Router();

router.get('/:id/following',authorizeRoles('user', 'admin'), followController.getAllFollowingForUser);
router.get('/:id/followers',authorizeRoles('user', 'admin'), followController.getAllFollowersForUser);
router.post('/:id/follow' ,authorizeRoles('user', 'admin'), followController.FollowSomeone);
router.post('/:id/unfollow' ,authorizeRoles('user', 'admin'), followController.UnfollowSomeone);

export default router;