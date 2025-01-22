// export interface LoginCredentials {
//   username: string;
//   password: string;
// }

// export interface SignUpCredentials extends LoginCredentials {
//   email: string;
//   firstName: string;
//   lastName: string;
//   mobile: number;
// }

// export interface AuthResponse {
//   access_token: string;
//   refresh_token: string;
//   token_type: string;
//   expires_in: number;
// }
// types/auth.ts
export interface LoginCredentials {
    username: string;
    password: string;
  }
  
  export interface SignUpCredentials {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    mobile: number;
  }
  
  export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
    scope?: string;
  }