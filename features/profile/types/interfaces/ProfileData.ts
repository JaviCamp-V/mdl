import AccessLevel from '@/features/auth/types/enums/AccessLevel';
import UserAccountResponse from '@/features/auth/types/interfaces/UserAccountResponse';

export default interface ProfileData {
  id: number;
  username: string;
  displayName: string;
  bio: string | null | undefined;
  avatarUrl: string | null | undefined;
  location: string | null | undefined;
  birthday: string | null | undefined;
  joinedAt: string;
  lastOnlineAt: string;
  enabled: boolean;
  accessLevels: AccessLevel[];
}

export interface ProfileDataWithAccount extends UserAccountResponse, ProfileData {}
