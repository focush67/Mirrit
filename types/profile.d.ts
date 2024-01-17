export interface AuthProfile {
  email: string;
  name: string;
  image: string;
}

export interface UserProfile extends AuthProfile {
  followers: AuthProfile[];
  following: AuthProfile[];
  createdAt?: any;
  updatedAt?: any;
}
