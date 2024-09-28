import { AuthService } from '../services/auth.service';
import { verifyJwt } from '../utils/token';
import { Request, Response, NextFunction } from 'express';

export const authGuard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const accessToken = req.cookies.access_token;

    if (!accessToken) {
      res.status(401).json({
        message: 'Unauthorized',
      });
      return;
    }

    const verify = await verifyJwt(accessToken);

    if (!verify) {
      res.status(401).json({
        message: 'Unauthorized',
      });
      return;
    }

    const userId = verify.userId;

    const user = await AuthService.findUserById(userId);

    if (!user) {
      res.status(401).json({
        message: 'Unauthorized',
      });
      return;
    }

    req.user = user;

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({
      message: 'Unauthorized',
    });
    return;
  }
};
