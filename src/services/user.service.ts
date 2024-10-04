import { User } from '../models/user.model';
import { compareStr } from '../utils/crypt';

type UserCreateData = {
  username: string;
  email: string;
  password: string;
  avatar?: string;
};

export class UserService {
  static UserModel = User;

  static async create(data: UserCreateData) {
    const user = new User(data);
    return user.save();
  }

  static async findByCredentials(email: string, password: string) {
    const userFound = await User.findOne({ email });

    if (!userFound) {
      return null;
    }

    const isMatch = await compareStr(password, userFound.password);

    if (!isMatch) {
      return null;
    }

    return userFound;
  }

  static async findUserById(userId: string) {
    return User.findById(userId);
  }
}
