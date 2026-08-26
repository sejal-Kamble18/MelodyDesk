export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  isVerified: boolean;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type RegisterResult = {
  needsEmailVerification: boolean;
};

export type ResetPasswordPayload = {
  password: string;
  confirmPassword: string;
};
