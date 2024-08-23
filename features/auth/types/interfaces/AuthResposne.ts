import AccessLevel from '../enums/AccessLevel';
import Role from '../enums/Role';

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
