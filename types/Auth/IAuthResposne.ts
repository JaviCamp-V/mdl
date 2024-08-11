import AccessLevel from './AccessLevel';
import Role from './Role';

export default interface AuthResponse {
  accessToken: string;
  tokenType: string;
  refreshToken: string;
  expiresIn: number;
  userId: number;
  username: string;
  role: Role;
  accessLevels: AccessLevel[];
}
