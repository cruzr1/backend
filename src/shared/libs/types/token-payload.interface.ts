export interface TokenPayload {
  sub?: string;
  email: string;
  name: string;
  friends?: string[];
}
