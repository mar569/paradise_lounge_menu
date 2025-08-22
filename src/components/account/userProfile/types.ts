// types.ts
export interface VisitData {
  id: string;
  userId: string;
  avatarUrl: string;
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
  cashback: number;
  orderAmount: number;
  cafeName?: string;
  isDeduction?: boolean;
}

export interface UserData {
  id: string;
  userId: string;
  name: string;
  email: string;
  dateOfBirth: string;
  createdAt: Date;
  status: 'pending' | 'active' | 'admin' | 'deleted';
  emailVerified: boolean;
  avatarUrl?: string;
  visits: number;
  cashback: number;
  orderAmount: number;
}
