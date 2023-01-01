import { GetAllCategoryResponse } from '../../types/response';

export const categoriesMock: GetAllCategoryResponse = {
  data: [
    {
      id: 1,
      image: 'category-1.png',
      name: 'Animal',
      level: 1,
      category: [],
    },
    {
      id: 2,
      image: 'category-2.png',
      name: 'Book',
      level: 1,
      category: [],
    },
    {
      id: 3,
      image: 'category-3.png',
      name: 'Camping',
      level: 1,
      category: [],
    },
    {
      id: 4,
      image: 'category-4.png',
      name: 'Doll',
      level: 1,
      category: [],
    },
    {
      id: 5,
      image: 'category-5.png',
      name: 'Electronic',
      level: 1,
      category: [],
    },
  ],
  code: 200,
  error: null,
  message: 'OK',
  metadata: null,
};
