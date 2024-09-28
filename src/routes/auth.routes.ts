import { Router } from 'express';
import { AuthService } from '../services/auth.service';
import { validate } from '../middlewares/validate';
import { loginSchema, registerSchema } from '../validations/auth.validations';
import { authGuard } from '../guards/auth.guard';

const authRouter = Router();

authRouter.post(
  '/sign-up',
  validate({
    body: registerSchema,
  }),
  async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const response = await AuthService.signUp({ username, email, password });

      res
        .cookie('access_token', response.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
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
        .cookie('access_token', response.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
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

authRouter.post('/sign-out', async (req, res) => {
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
