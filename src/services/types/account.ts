export interface IUser {
  id: string;
  email: string;
  name: string;
  avatar: string;
  role: string;
  isEmailConfirmed: boolean;
  createdAt: string;
}

export interface IUpdateProfileRequest {
  name?: string;
  avatar?: string;
}

export interface IChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}

export interface IRegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface IRegisterResponse {
  message: string;
}

export interface IUtilityOptionsResponse {
  options: IOption[];
}

export interface IOption {
  value: string;
  label: string;
}
