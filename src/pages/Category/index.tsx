import moment from 'moment';
import { useEffect, useState } from 'react';
import { Button, Card, Divider } from 'react-daisyui';
import { Link } from 'react-router-dom';
import { Image } from '../../components/common';
import { useLocalStorage } from '../../hooks';
import { useLazyGetAllCategoryQuery } from '../../store/services/categoryService';
import { Category as CategoryComponent } from '../../types/component';
import { CategoryQuery } from '../../types/query';
import { toCategoryQuery } from '../../utils/mapperDTO';
import { toUrl } from '../../utils/toUrl';

type CategoryStorage = {
  value: CategoryComponent[];
  timestamp: Date | null;
};

const Category = () => {
  const categoryQuery: CategoryQuery = {
    categoryID: 0,
    levelDepth: 0,
  };

  const [categoriesStorage, setCategoryStorage] =
    useLocalStorage<CategoryStorage>('categories', {
      value: [],
      timestamp: null,
    });

  const [categories, setCategories] = useState<CategoryComponent[]>([]);

  const [getAllCategory] = useLazyGetAllCategoryQuery();

  useEffect(() => {
    try {
      if (categoriesStorage.value.length === 0) {
        throw new Error('empty storage value');
      }

      setCategories(categoriesStorage.value);
    } catch (e) {
      getAllCategory(toCategoryQuery(categoryQuery))
        .unwrap()
        .then((res) => {
          setCategories(res.data ? res.data : []);
          setCategoryStorage({
            value: res.data ? res.data : [],
            timestamp: moment().add(1, 'day').toDate(),
          });
        });
    }
  }, []);

  const arrCategory: string[] = [];
  const uniqueLetter: string[] = [];
  for (const [, value] of Object.entries(categories)) {
    arrCategory.push(value.name);
    if (!uniqueLetter.includes(String(value.name.at(0)))) {
      uniqueLetter.push(String(value.name.at(0)));
    }
  }

  const letterButton: string[] = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ];

  const handleClickScroll = (letter: string) => {
    const element = document.getElementById('section-' + letter.toUpperCase());
    if (element) {
      const y = element.getBoundingClientRect().top + window.pageYOffset - 180;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  if (categories.length === 0) {
    return (
      <div className='px-2 container mx-auto flex flex-col items-center'>
        <div className='overflow-x-auto flex gap-3 py-5 px-5 fixed bg-base-100 z-10 bg-opacity-80 backdrop-blur shadow-md w-full md:justify-center'>
          {letterButton.map((letter, n) => (
            <Button key={n} disabled>
              {letter}
            </Button>
          ))}
        </div>
        <div className='py-5 flex flex-col gap-5 mt-24 w-full md:items-center'>
          {Array.from({ length: 10 }, (_, index) => index + 1).map((row) => {
            return (
              <Card
                key={row}
                className='shadow-md w-full md:w-[50vw] animate-pulse'
              >
                <Card.Body>
                  <div className='flex flex-col items-center justify-center'>
                    <div className='h-6 w-2/5 bg-base-200 rounded-full my-8'></div>
                    <Divider />
                    <div className='grid grid-cols-12 w-full gap-10'>
                      <div className='col-span-12 md:col-span-6'>
                        <div className='w-3/5 h-4 bg-base-200 rounded-full mb-2.5'></div>
                        <div className='w-full h-4 bg-base-200 rounded-full mb-2'></div>
                        <div className='w-full h-4 bg-base-200 rounded-full mb-2'></div>
                        <div className='w-full h-4 bg-base-200 rounded-full mb-2'></div>
                      </div>
                      <div className='col-span-12 md:col-span-6'>
                        <div className='w-3/5 h-4 bg-base-200 rounded-full mb-2.5'></div>
                        <div className='w-full h-4 bg-base-200 rounded-full mb-2'></div>
                        <div className='w-full h-4 bg-base-200 rounded-full mb-2'></div>
                        <div className='w-full h-4 bg-base-200 rounded-full mb-2'></div>
                      </div>
                      <div className='col-span-12 md:col-span-6'>
                        <div className='w-3/5 h-4 bg-base-200 rounded-full mb-2.5'></div>
                        <div className='w-full h-4 bg-base-200 rounded-full mb-2'></div>
                        <div className='w-full h-4 bg-base-200 rounded-full mb-2'></div>
                        <div className='w-full h-4 bg-base-200 rounded-full mb-2'></div>
                      </div>
                      <div className='col-span-12 md:col-span-6'>
                        <div className='w-3/5 h-4 bg-base-200 rounded-full mb-2.5'></div>
                        <div className='w-full h-4 bg-base-200 rounded-full mb-2'></div>
                        <div className='w-full h-4 bg-base-200 rounded-full mb-2'></div>
                        <div className='w-full h-4 bg-base-200 rounded-full mb-2'></div>
                      </div>
                      <div className='col-span-12 md:col-span-6'>
                        <div className='w-3/5 h-4 bg-base-200 rounded-full mb-2.5'></div>
                        <div className='w-full h-4 bg-base-200 rounded-full mb-2'></div>
                        <div className='w-full h-4 bg-base-200 rounded-full mb-2'></div>
                        <div className='w-full h-4 bg-base-200 rounded-full mb-2'></div>
                      </div>
                      <div className='col-span-12 md:col-span-6'>
                        <div className='w-3/5 h-4 bg-base-200 rounded-full mb-2.5'></div>
                        <div className='w-full h-4 bg-base-200 rounded-full mb-2'></div>
                        <div className='w-full h-4 bg-base-200 rounded-full mb-2'></div>
                        <div className='w-full h-4 bg-base-200 rounded-full mb-2'></div>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className='px-2 container mx-auto flex flex-col items-center'>
      <div className='overflow-x-auto flex gap-3 py-5 px-5 fixed bg-base-100 z-10 bg-opacity-80 backdrop-blur shadow-md w-full md:justify-center'>
        {letterButton.map((letter, n) => (
          <Button
            key={n}
            onClick={() => {
              handleClickScroll(letter);
            }}
            disabled={!uniqueLetter.includes(letter) ? true : false}
          >
            {letter}
          </Button>
        ))}
      </div>
      <div className='py-5 flex flex-col gap-5 mt-24 w-full md:items-center'>
        {categories.map((category, n) => {
          const currentFirstLetter = category.name.at(0);

          return (
            <div key={n} className='flex md:gap-10'>
              <div className='w-0 md:w-5'>
                {n === 0 ||
                arrCategory.at(n - 1)?.at(0) !== currentFirstLetter ? (
                  <div id={'section-' + currentFirstLetter}>
                    <h1 className='text-5xl font-bold hidden md:flex'>
                      {currentFirstLetter}
                    </h1>
                  </div>
                ) : null}
              </div>
              <Card className='p-5 w-full md:w-[50vw] shadow-md rounded-none flex gap-5'>
                <div className='flex gap-5 items-center justify-center p-5 rounded-xl'>
                  <Image
                    src={category.image}
                    alt={category.name}
                    className='w-10 h-10 md:w-20 md:h-20'
                  ></Image>
                  <Link
                    to={`/category/${toUrl(category.name)}-i.${category.id}`}
                  >
                    <h1 className='text-3xl font-bold text-center cursor-pointer hover:text-primary'>
                      {category.name}
                    </h1>
                  </Link>
                </div>
                <Divider className='m-0' />
                <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
                  {category?.category &&
                    category?.category.map((subCategory, n2) => {
                      return (
                        <div className='gap-5 cols-span-1 md:w-[90%]' key={n2}>
                          <Link
                            to={`/category/${toUrl(subCategory.name)}-i.${
                              subCategory.id
                            }`}
                          >
                            <span className='text-md font-bold cursor-pointer hover:text-primary'>
                              {subCategory.name}
                            </span>
                          </Link>
                          <div className='grid grid-cols-3 gap-5 justify-between'>
                            {subCategory?.category &&
                              subCategory?.category.map(
                                (subSubCategory, n3) => {
                                  return (
                                    <div key={n3} className='cols-span-1'>
                                      <Link
                                        to={`/category/${toUrl(
                                          subSubCategory.name
                                        )}-i.${subSubCategory.id}`}
                                      >
                                        <span className='text-sm break-normal cursor-pointer hover:text-primary'>
                                          <h1>{subSubCategory.name}</h1>
                                        </span>
                                      </Link>
                                    </div>
                                  );
                                }
                              )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Category;
