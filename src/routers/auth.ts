import {Router} from 'express';
import { CreateUserSchema, SignInValidationSchema, TokenAndIDValidation, UpdatePasswordSchema } from '#/utiles/validationSchema';
import { validate } from '#/middleware/validator';
import { create, generateForgetPasswordLink, grantValid, logout, sendProfile, sendReverificationToken, signIn, updatePassword, updateProfile, verifyEmail } from '#/controller/auth';
import { isValidPasswordResetToken, mustAuth } from '#/middleware/auth';
import fileParser, { RequestWithFiles } from '#/middleware/fileParser';

const router = Router();

router.post('/create', validate(CreateUserSchema), create);
router.post('/verify-email', validate(TokenAndIDValidation), verifyEmail);
router.post('/re-verify-email', sendReverificationToken); 
router.post('/forget-password', generateForgetPasswordLink);
router.post('/verify-pass-reset-token', validate(TokenAndIDValidation), isValidPasswordResetToken, grantValid);
router.post('/update-password', validate(UpdatePasswordSchema), isValidPasswordResetToken,  updatePassword);

router.post('/sign-in', validate(SignInValidationSchema), signIn); 
 
router.get('/is-auth', mustAuth, sendProfile)  
 

router.post('/update-profile', mustAuth, fileParser, updateProfile);
router.post('/log-out', mustAuth, logout)
   
export default router       