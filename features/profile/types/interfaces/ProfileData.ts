export default interface ProfileData {
  id: number;
  username: string;
  email?: string; // only for the current user
  displayName: string;
  bio: string;
  avatarUrl: string;
  location: string;
  birthday: string;
  joinedAt: string;
  lastOnlineAt: string;
  enabled: boolean;
}
