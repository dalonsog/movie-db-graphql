import jwt, { Secret } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserModel, Token } from '../types.js';

const secret = process.env.JWT_SECRET as Secret;

export const hashPassword = async (pwd: string): Promise<string> => {
  return await bcrypt.hash(pwd, 10);
};

export const verifyPassword = async (
  pwd: string,
  userPwd: string
): Promise<boolean> => {
  return await bcrypt.compare(pwd, userPwd);
};

export const generateToken = (
  user: UserModel,
  expiresIn: number = 1800
): Token => {
  const { id, username, role } = user;
  const token = jwt.sign(
    { id, username, role},
    secret, 
    { expiresIn }
  );
  return { token };
};

export const getAuthUser = (token: string): UserModel | null => {
  try {
    return jwt.verify(token, secret) as UserModel;
  } catch {
    return null;
  }
};