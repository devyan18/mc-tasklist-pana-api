import { genSalt, hash, compare } from 'bcrypt';

export const hashStr = async (str: string) => {
  const salt = await genSalt(10);
  return hash(str, salt);
};

export const compareStr = async (str: string, hash: string) => {
  return compare(str, hash);
};
