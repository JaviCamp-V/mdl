export default interface AuthResponse {
  accessToken: string;
  tokenType: string;
  refreshToken: string;
  expiresIn: number;
  deviceID: string;
}
