import bcrypt from 'bcrypt';

export const hashPassword = async (pwd: string): Promise<string> => {
  return await bcrypt.hash(pwd, 10);
};

export const verifyPassword = async (
  pwd: string,
  userPwd: string
): Promise<boolean> => {
  return await bcrypt.compare(pwd, userPwd);
};