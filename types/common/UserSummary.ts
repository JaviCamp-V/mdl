export default interface UserSummary {
  id: number;
  username: string;
  displayName: string;
  avatarUrl: string | null | undefined;
  enabled: boolean;
}

export interface withUserSummary {
  user: UserSummary;
}
