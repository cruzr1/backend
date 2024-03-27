export const SALT_ROUNDS = 11;
export const USER_EXISTS = 'User with email exists';
export const USER_NOT_FOUND = 'User not found';
export const USER_PASSWORD_WRONG = 'User password is wrong';
export const REFRESH_TOKEN_NOT_EXISTS = 'Refresh token does not exist';
export const USERMAIL_FIELD = 'email';
export const MAX_TRAIN_TYPE_ARRAY_SIZE = 3;
export const ADD_FRIEND = 'You have been added to friends';
export const REMOVE_FRIEND = 'You have been removed from friends';
export const USER_FORBIDDEN_CHANGE = 'User may not change field';
export const USER_NOT_FRIEND = 'User is not a friend';

export const UserValidationParams = {
  Email: {
    Regex: RegExp(/.+@.+\.\D{2,3}$/),
  },
  Name: {
    Length: {
      Minimal: 1,
      Maximal: 15,
    },
    Regex: RegExp(/^\D+$/gm),
  },
  Password: {
    Length: {
      Minimal: 6,
      Maximal: 12,
    },
  },
  Image: {
    Regex: RegExp(/(.png$|.jpg$|.jpeg$)/i),
  },
  Description: {
    Length: {
      Minimal: 10,
      Maximal: 140,
    },
  },
  Calories: {
    Value: {
      Minimal: 1000,
      Maximal: 5000,
    },
  },
  Certificates: {
    Regex: RegExp(/.pdf/i),
  },
} as const;

export const UserValidationMessage = {
  UserId: {
    InvalidFormat: 'User id should be valid mongo id',
  },
  Email: {
    InvalidFormat: 'User e-mail should have format user@domain.com',
  },
  Name: {
    InvalidFormat: 'User name should have a string format',
    InvalidLength:
      'User name should have a minimal length of 1 letters, maximal length of 15 letters',
  },
  Password: {
    InvalidLength:
      'User password should have a minimal length of 6 letters, maximal length of 12 letters',
    InvalidPassword: 'User password should be a string value',
  },
  Avatar: {
    InvalidFormat: 'User avatar should be jpg or png image file',
  },
} as const;
