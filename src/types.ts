export interface User {
    id: string;
    email: string;
    name: string;
  }
  
  export interface LoginResponse {
    message: string;
    user: User;
  }
  
  export interface LoginError {
    message: string;
  }