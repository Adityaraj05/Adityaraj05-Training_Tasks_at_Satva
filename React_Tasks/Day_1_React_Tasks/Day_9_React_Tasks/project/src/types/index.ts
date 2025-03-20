export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  createdAt: Date;
}

export type ThemeMode = 'light' | 'dark';