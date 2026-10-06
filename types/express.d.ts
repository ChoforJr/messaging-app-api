declare global {
  namespace Express {
    interface User {
      id: number;
      username: string;
      profileID: number;
    }
  }
}

export {};
