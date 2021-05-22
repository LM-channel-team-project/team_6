import bcrypt from "bcrypt";
import { getRepository } from "typeorm";
import { User } from "@models/entity/User";
import * as custom from "@utils/custom";

// Get Users
export const findUsers = async () => {
  const users = await getRepository(User).find();
  if (!users) {
    throw new custom.CustomError(400, custom.message.USER_FIND_ONE_FAIL);
  }
  return users;
};

// Get User
export const findUser = async (userId: string) => {
  const user = await getRepository(User).findOne(userId);
  if (!user) {
    throw new custom.CustomError(400, custom.message.USER_FIND_ONE_FAIL);
  }
  return user;
};

// Create and Save
export const createUser = async (userBody: User) => {
  const { nickname, username, email, password } = userBody;
  const user = await getRepository(User).findOne({ where: { email } });

  if (user) {
    throw new custom.CustomError(400, custom.message.USER_ALREADY_USED_EMAIL);
  }

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  const userRecord = getRepository(User).create({
    email,
    nickname,
    username,
    password: hashedPassword,
  });

  const result = await getRepository(User).save(userRecord);
  return result;
};

// Update General Information and Save
export const updateUserGeneral = async (userBody: User, userId: string) => {
  const { nickname, username } = userBody;
  const user = await getRepository(User).findOne({ where: { id: userId } });

  if (!user) {
    throw new custom.CustomError(400, custom.message.USER_LOGIN_FIND_USER_FAIL);
  }
  const userRecord = getRepository(User).create({
    ...user,
    nickname: nickname,
    username: username,
  });

  getRepository(User).merge(user, userRecord);
  const result = await getRepository(User).save(userRecord);
  return result;
};

// Update Password and Save
export const updateUserPassword = async (userBody: User, userId: string) => {
  const { password } = userBody;
  const user = await getRepository(User).findOne({ where: { id: userId } });

  if (!user) {
    throw new custom.CustomError(400, custom.message.USER_LOGIN_FIND_USER_FAIL);
  }
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  const userRecord = getRepository(User).create({
    password: hashedPassword,
  });

  getRepository(User).merge(user, userRecord);
  const result = await getRepository(User).save(userRecord);
  return result;
};

// Delete
export const deleteUser = async (userId: string) => {
  const result = await getRepository(User).delete(userId);

  if (!result) {
    throw new custom.CustomError(400, custom.message.USER_WITHDRAW_FAIL);
  }
  return result;
};
