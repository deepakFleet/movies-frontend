export interface LoginResponse {
  accessToken: string;
  email: string;
  firstName: string;
  id: number;
  lastName: string;
  roles: string[];
  tokenType: string;
  status?: number;
}
