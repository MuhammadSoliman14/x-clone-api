import express from 'express';
import * as tweetController from '../controllers/tweetController.js';
import { authorizeRoles } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { tweetSchema } from '../validators/schema.js';
const router = express.Router();


//public
router.get('/users/:id/tweets', tweetController.getAllTweetsForUser);
router.get('/:id', tweetController.getTweet);

//protected
router.post('/' , authorizeRoles('user', 'admin' ), validate(tweetSchema), tweetController.createTweet);
router.delete('/:id', authorizeRoles('user' ,'admin'), tweetController.deleteTweet);
router.post('/:id/like', authorizeRoles('user' ,'admin'), tweetController.likeTweet);
router.post('/:id/unlike',authorizeRoles('user' ,'admin'), tweetController.unLikeTweet);
router.post('/:id/bookmark', authorizeRoles('user' ,'admin'), tweetController.bookmarkTweet);
router.post('/:id/unbookmark',authorizeRoles('user' ,'admin'),  tweetController.unBookmarkTweet);

export default router

