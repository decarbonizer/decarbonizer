export interface LoginPost {
  email: string;
  password: string;
}

export interface LoginResult {
  access_token: string;
  token_type: string;
}
