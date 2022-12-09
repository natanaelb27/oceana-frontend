import { FormEvent, useState } from 'react';
import {
  Button,
  Checkbox,
  Collapse,
  Divider,
  Form,
  Input,
} from 'react-daisyui';
import { HiOutlineChevronDown } from 'react-icons/hi';
import { IoFilter } from 'react-icons/io5';
import { Link, useParams } from 'react-router-dom';
import {
  useGetAllCategoryQuery,
  useGetAncestorsCategoryQuery,
} from '../../store/services/categoryService';
import { CategoryQuery, ProductQuery } from '../../types/query';
import { GetAllCategoryResponse } from '../../types/response';
import { toCategoryQuery } from '../../utils/mapperDTO';
import { FilterSidebarContainer } from './style';

type FilterSidebarProps = {
  productQuery: ProductQuery;
  setProductQuery: (query: ProductQuery) => void;
};

const FilterSidebar = ({
  productQuery,
  setProductQuery,
}: FilterSidebarProps) => {
  const { categoryPath } = useParams();
  if (!categoryPath) {
    return null;
  }
  const categoryID = categoryPath.split('-i.').slice(-1)[0].split('-')[0];

  const { data: resGetAncestorsCategory } =
    useGetAncestorsCategoryQuery(categoryID);

  const [categoryQuery, setCategoryQuery] = useState<CategoryQuery>({
    categoryID: resGetAncestorsCategory?.data?.at(0)?.id || 0,
    levelDepth: 0,
  });

  const { data: resGetAllCategory } = useGetAllCategoryQuery(
    toCategoryQuery(categoryQuery),
    {
      skip: categoryQuery.categoryID === 0,
    }
  );

  console.log(resGetAllCategory);

  const handleClickFilterToggle = () => {
    const filterSidebarEl = document.getElementById('filter-sidebar');
    filterSidebarEl?.classList.toggle('-left-full');
    filterSidebarEl?.classList.toggle('left-0');
    const productListSearchPageEl = document.getElementById(
      'product-list-search-page'
    );
    productListSearchPageEl?.classList.toggle('hidden');
  };

  const handleSubmitFilterPrice = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      priceMinimum: { value: string };
      priceMaximum: { value: string };
    };
    setProductQuery({
      ...productQuery,
      priceMinimum: Number(target.priceMinimum.value),
      priceMaximum: Number(target.priceMaximum.value),
    });
  };

  return (
    <>
      <FilterSidebarContainer id='filter-sidebar'>
        <div className='w-full py-4 flex justify-center items-center gap-2 text-lg font-bold'>
          <IoFilter />
          <h5>FILTER</h5>
        </div>
        <Divider className='m-0' />

        <Collapse checkbox icon='arrow' className='border-b-2 border-base-200'>
          <Collapse.Title className='font-bold'>
            Category - <span>{resGetAncestorsCategory?.data?.at(0)?.name}</span>
          </Collapse.Title>
          <Collapse.Content>
            <div>{}</div>
            <Form>
              <Form.Label title='Nothing to see aa...'>
                <HiOutlineChevronDown></HiOutlineChevronDown>
              </Form.Label>
            </Form>
          </Collapse.Content>
        </Collapse>
        <Collapse checkbox icon='arrow' className='border-b-2 border-base-200'>
          <Collapse.Title className='font-bold'>Location</Collapse.Title>
          <Collapse.Content>
            <Form>
              <Form.Label title='Nothing to see here...'>
                <Checkbox />
              </Form.Label>
            </Form>
          </Collapse.Content>
        </Collapse>
        <Collapse checkbox icon='arrow' className='border-b-2 border-base-200'>
          <Collapse.Title className='font-bold'>Price</Collapse.Title>
          <Collapse.Content>
            <Form onSubmit={handleSubmitFilterPrice}>
              <Form.Label title='Min'>
                <Input
                  name='priceMinimum'
                  type='text'
                  className='w-full ml-2 focus:border-primary'
                />
              </Form.Label>
              <Form.Label title='Max'>
                <Input
                  name='priceMaximum'
                  type='text'
                  className='w-full ml-2 focus:border-primary'
                />
              </Form.Label>
              <Input type='submit' hidden />
            </Form>
          </Collapse.Content>
        </Collapse>
        <Collapse checkbox icon='arrow' className='border-b-2 border-base-200'>
          <Collapse.Title className='font-bold'>Rating</Collapse.Title>
          <Collapse.Content>
            <Form>
              <Form.Label title='⭐ 4 and above'>
                <Checkbox />
              </Form.Label>
              <Form.Label title='⭐ 3 and above'>
                <Checkbox />
              </Form.Label>
              <Form.Label title='⭐ 2 and above'>
                <Checkbox />
              </Form.Label>
            </Form>
          </Collapse.Content>
        </Collapse>
      </FilterSidebarContainer>
      <Button
        className='fixed bottom-10 right-10 btn-circle text-xl drop-shadow-xl z-40 md:hidden'
        color='primary'
        onClick={handleClickFilterToggle}
      >
        <IoFilter />
      </Button>
    </>
  );
};

export default FilterSidebar;
