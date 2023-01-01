import { Category, CategoryDetails, Metadata } from '../component';

export type GetAllCategoryResponse = {
  data: Category[] | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type GetAncestorsCategoryResponse = {
  data: CategoryDetails[] | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type GetCategoriesByMerchantIDResponse = {
  data: Category[] | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};
