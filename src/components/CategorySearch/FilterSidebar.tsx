import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  Collapse,
  Divider,
  Form,
  Input,
} from 'react-daisyui';
import { HiOutlineChevronDown, HiOutlineChevronUp } from 'react-icons/hi';
import { IoFilter } from 'react-icons/io5';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  useGetAllCategoryQuery,
  useGetAncestorsCategoryQuery,
} from '../../store/services/categoryService';
import { Category } from '../../types/component';
import { CategoryQuery, ProductQuery } from '../../types/query';
import { GetAllCategoryResponse } from '../../types/response';
import { toCategoryQuery } from '../../utils/mapperDTO';
import { toUrl } from '../../utils/toUrl';
import { FilterSidebarContainer } from './style';

type FilterSidebarProps = {
  productQuery: ProductQuery;
  setProductQuery: (query: ProductQuery) => void;
  category: Category[];
};

type CategoryState = {
  id: number;
  open: boolean;
};

const FilterSidebar = ({
  productQuery,
  setProductQuery,
  category,
}: FilterSidebarProps) => {
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

  const handleSubmitFilterRating = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target as typeof e.target & {
      rating: { value: string };
    };

    if (target.checked) {
      setProductQuery({
        ...productQuery,
        rating: Number(target.value),
      });
    } else {
      setProductQuery({
        ...productQuery,
        rating: 0,
      });
    }
  };

  const navigate = useNavigate();

  const handleCategoryClick = (categoryName: string, categoryID: number) => {
    navigate(`/category/${toUrl(categoryName)}-i.${categoryID}`);
  };

  const [subSubCategoryCollapse, setSubSubCategoryCollapse] = useState<
    boolean[]
  >([]);

  const handleCollapseClick = (index: number) => {
    const newCollapse = subSubCategoryCollapse.map((value, i) => {
      if (i === index) {
        return !value;
      } else {
        return value;
      }
    });
    setSubSubCategoryCollapse(newCollapse);
  };

  useEffect(() => {
    const data: boolean[] = [];
    category?.at(0)?.category.map(() => data.push(false));
    setSubSubCategoryCollapse(data);
  }, []);

  const handleCollapseClose = () => {
    const data: boolean[] = [];
    category?.at(0)?.category.map(() => data.push(false));
    setSubSubCategoryCollapse(data);
  };

  return (
    <>
      <FilterSidebarContainer id='filter-sidebar'>
        <div className='w-full py-4 flex justify-center items-center gap-2 text-lg font-bold'>
          <IoFilter />
          <h5>FILTER</h5>
        </div>
        <Divider className='m-0' />

        <Collapse
          checkbox
          icon='arrow'
          onClose={handleCollapseClose}
          className='border-b-2 border-base-200'
        >
          <Collapse.Title className='font-bold'>
            Category - <span>{category?.at(0)?.name}</span>
          </Collapse.Title>
          <Collapse.Content className='flex flex-col gap-5'>
            {category?.at(0)?.category.map((subCategory, i) => {
              return (
                <div key={i} className='flex flex-col gap-1'>
                  <div className='flex justify-between items-center'>
                    <span
                      className='cursor-pointer hover:text-primary font-bold'
                      onClick={() => {
                        handleCategoryClick(subCategory?.name, subCategory?.id);
                      }}
                    >
                      {subCategory?.name}
                    </span>
                    <HiOutlineChevronDown
                      className={`cursor-pointer transition-transform duration-300 ${
                        subSubCategoryCollapse.at(i) ? 'rotate-180' : ''
                      }`}
                      onClick={() => {
                        handleCollapseClick(i);
                      }}
                    />
                  </div>
                  <div
                    key={i}
                    className={`flex flex-col gap-2 border-2 p-2 rounded-md mt-2 ${
                      subSubCategoryCollapse.at(i) ? 'flex' : 'hidden'
                    }`}
                  >
                    {subCategory?.category.map((subSubCategory, i) => {
                      return (
                        <div
                          key={i}
                          className='flex justify-between cursor-pointer hover:text-primary'
                          onClick={() => {
                            handleCategoryClick(
                              subSubCategory?.name,
                              subSubCategory?.id
                            );
                          }}
                        >
                          <span className='ml-2'>{subSubCategory.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </Collapse.Content>
        </Collapse>
        <Divider className='m-0'></Divider>
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
        <Divider className='m-0'></Divider>
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
        <Divider className='m-0'></Divider>
        <Collapse checkbox icon='arrow' className='border-b-2 border-base-200'>
          <Collapse.Title className='font-bold'>Rating</Collapse.Title>
          <Collapse.Content>
            <Form>
              <Form.Label title='⭐ 4 and above'>
                <Checkbox
                  name='rating'
                  value={4}
                  onChange={handleSubmitFilterRating}
                />
              </Form.Label>
              {/* <Form.Label title='⭐ 3 and above'>
                <Checkbox />
              </Form.Label>
              <Form.Label title='⭐ 2 and above'>
                <Checkbox />
              </Form.Label> */}
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
