import { Router } from 'express';
import { AuthService } from '../services/auth.service';
import { validate } from '../middlewares/validate';
import { loginSchema, registerSchema } from '../validations/auth.validations';
import { authGuard } from '../guards/auth.guard';
import { uploadImage } from '../middlewares/uploadImage';
import { config } from '../settings/config';

const authRouter = Router();

authRouter.post(
  '/sign-up',
  uploadImage('avatar'),
  validate({
    body: registerSchema,
  }),
  async (req, res) => {
    try {
      const { username, email, password, avatar } = req.body;
      const response = await AuthService.signUp({
        username,
        email,
        password,
        avatar,
      });

      res
        .cookie(config.accessCookieName, response.accessToken, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: 'none',
          secure: config.nodeEnv === 'production',
        })
        .json(response);
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: 'Error signing up',
      });
    }
  },
);

authRouter.post(
  '/sign-in',
  validate({
    body: loginSchema,
  }),
  async (req, res) => {
    try {
      const { email, password } = req.body;
      const response = await AuthService.signIn({ email, password });

      res
        .cookie(config.accessCookieName, response.accessToken, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: 'none',
          secure: config.nodeEnv === 'production',
        })
        .json(response);
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: 'Error signing in',
      });
    }
  },
);

authRouter.post('/sign-out', async (_req, res) => {
  res.clearCookie('access_token').json({ message: 'Signed out' });
});

authRouter.get('/me', authGuard, async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: 'Error getting user',
    });
  }
});

export { authRouter };
