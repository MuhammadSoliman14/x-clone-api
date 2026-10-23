import  express from 'express';
import {register, login} from '../controllers/authController.js';
import { loginSchema, registerSchema } from '../validators/schema.js';
import { validate } from '../middleware/validate.js';
const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

export default router;
