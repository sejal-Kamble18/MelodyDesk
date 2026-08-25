export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
  avatar: string;
  isVerified: boolean;
};

export type BackendUser = {
  id: string;
  email: string;
  full_name: string | null;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
};

export type TokenResponse = {
  access_token: string;
  refresh_token: string;
  token_type: 'bearer';
  expires_in: number;
  refresh_expires_at: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  organization: string;
};

export type AuthResponse = {
  user: AuthUser;
  token: string;
  refreshToken: string;
};
