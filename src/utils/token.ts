import jwt from 'jsonwebtoken';
import { config } from '../settings/config';

type Payload = {
  userId: string;
};

export const createJwt = async (payload: Payload): Promise<string | null> => {
  const expired = '60d';

  try {
    return new Promise((res, rej) => {
      jwt.sign(payload, config.secret, { expiresIn: expired }, (err, token) => {
        if (err) {
          rej(err);
        } else {
          res(token!);
        }
      });
    });
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const verifyJwt = async (token: string): Promise<Payload | null> => {
  try {
    return new Promise((res, rej) => {
      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          rej(err);
        } else {
          res(decoded as Payload);
        }
      });
    });
  } catch (error) {
    console.error(error);
    return null;
  }
};
