export interface Category {
  id: number;
  image: string;
  name: string;
  level: number;
  category: Category[];
}
