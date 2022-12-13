export interface Category {
  id: number;
  image: string;
  name: string;
  level: number;
  category: Category[];
}

export interface CategoryDetails {
  id: number;
  media_url: string;
  name: string;
  parent_id: number;
}
