import AccessLevel from '../enums/AccessLevel';
import Role from '../enums/Role';

export default interface UserAccountResponse {
  userId: number;
  username: string;
  email: string;
  role: Role;
  accessLevels: AccessLevel[];
  isEmailVerified: boolean;
  displayName: string;
  avatarUrl: string | null | undefined;
}
