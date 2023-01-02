import { useEffect, useState } from 'react';
import { HiOutlineChevronDown } from 'react-icons/hi';
import { Category } from '../../../types/component';
import ClassNames from '../../../utils/classnames';

type CategoryCollapseProps = {
  category: Category[] | undefined;
  marginLeft: number;
  handleCategoryClick: (id: number, name: string) => void;
  childOnly?: boolean;
};
const CategoryCollapse = ({
  category,
  marginLeft,
  handleCategoryClick,
  childOnly,
}: CategoryCollapseProps) => {
  const [subCategoryCollapse, setSubCategoryCollapse] = useState<boolean[]>([]);

  const handleCollapseClick = (index: number) => {
    const newCollapse = subCategoryCollapse.map((value, i) => {
      if (i === index) {
        return !value;
      } else {
        return value;
      }
    });
    setSubCategoryCollapse(newCollapse);
  };

  useEffect(() => {
    const data: boolean[] = [];
    category?.map((category) => {
      if (category?.category) {
        category?.category.map(() => data.push(false));
      }
    });
    setSubCategoryCollapse(data);
  }, [category]);

  const handleClick = (id: number, name: string) => {
    handleCategoryClick(id, name);
  };

  return (
    <div className='mb-2 w-full'>
      {category?.map((category, i) => (
        <div key={'category-' + category.id} className={`ml-${marginLeft}`}>
          <div className='flex hover:bg-base-300 p-2 pr-1 rounded-md items-center justify-between'>
            <div
              className={ClassNames([
                'w-full',
                childOnly && category.category?.length > 0
                  ? ''
                  : 'cursor-pointer',
              ])}
              onClick={() => {
                if (childOnly && category.category?.length > 0) {
                  handleCollapseClick(i);
                  return;
                }
                handleClick(category.id, category.name);
              }}
            >
              <span className='text-sm'>{category.name}</span>
            </div>
            {category?.category ? (
              <HiOutlineChevronDown
                className={`cursor-pointer transition-transform duration-300 ${
                  subCategoryCollapse.at(i) ? 'rotate-180' : ''
                }`}
                onClick={() => {
                  handleCollapseClick(i);
                }}
              />
            ) : null}
          </div>
          {category.category?.length > 0 ? (
            <div
              className={`${subCategoryCollapse.at(i) ? 'flex' : 'hidden'}  `}
            >
              <CategoryCollapse
                category={category?.category}
                marginLeft={marginLeft + 2}
                handleCategoryClick={handleCategoryClick}
                childOnly={childOnly}
              ></CategoryCollapse>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default CategoryCollapse;
