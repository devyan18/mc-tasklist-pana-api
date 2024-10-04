import { UserDocument } from '../models/user.model';
import { UserService } from './user.service';
import { createJwt } from '../utils/token';

export type AuthResponse = {
  accessToken: string;
  user: UserDocument;
};

export class AuthService {
  static UserService = UserService;

  static async signUp({
    username,
    email,
    password,
    avatar,
  }: {
    username: string;
    email: string;
    password: string;
    avatar: string | undefined;
  }): Promise<AuthResponse> {
    const newUser = await this.UserService.create({
      username,
      email,
      password,
      avatar,
    });

    if (!newUser) {
      throw new Error('User not created');
    }

    const token = await createJwt({ userId: newUser.id });

    if (!token) {
      throw new Error('Token not created');
    }

    return {
      accessToken: token,
      user: newUser,
    };
  }

  static async signIn({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    const user = await this.UserService.findByCredentials(email, password);

    if (!user) {
      throw new Error('User not found');
    }

    const token = await createJwt({ userId: user.id });

    if (!token) {
      throw new Error('Token not created');
    }

    return {
      accessToken: token,
      user,
    };
  }

  static async findUserById(userId: string): Promise<UserDocument | null> {
    return this.UserService.findUserById(userId);
  }
}
