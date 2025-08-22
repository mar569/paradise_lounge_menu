// src/components/admin/types.ts
// types.ts
export interface User {
  id: string;
  userId: string;
  name: string;
  email: string;
  cashback: number;
  visits: number;
  status: 'admin' | 'active' | 'inactive' | 'pending';
  totalSpent: number; // Убедитесь, что это свойство присутствует
}
