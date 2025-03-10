export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface UserAuthenticated {
  id: string;
  email: string;
  role: UserRole;
}
