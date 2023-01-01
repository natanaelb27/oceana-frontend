import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  Collapse,
  Divider,
  Form,
  Input,
  InputGroup,
} from 'react-daisyui';
import { IoFilter } from 'react-icons/io5';
import { useGetCategoriesByMerchantIDQuery } from '../../../store/services/categoryService';
import { useGetAllCityQuery } from '../../../store/services/cityService';
import { CityQuery, ProductQuery } from '../../../types/query';
import { toCityQuery } from '../../../utils/mapperDTO';
import { handleNumberInvalidKey } from '../../../utils/validation';
import CategoryCollapse from '../../common/CategoryCollapse';

type CategoryFilter = {
  id: number;
  name: string;
};

type FilterSidebarProps = {
  merchantID?: string;
  productQuery: ProductQuery;
  setProductQuery: (query: ProductQuery) => void;
  setCategoryFilter: (categoryFilter: CategoryFilter) => void;
};

const FilterSidebar = ({
  productQuery,
  merchantID,
  setProductQuery,
  setCategoryFilter,
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

  const { data: resGetAllCategory } = useGetCategoriesByMerchantIDQuery(
    merchantID || '0'
  );

  const [cityQuery, setCityQuery] = useState<CityQuery>({
    search: '',
  });

  const { data: resGetAllCity } = useGetAllCityQuery(toCityQuery(cityQuery));

  const { data: resGetAllCityWithoutQuery } = useGetAllCityQuery('');

  const [priceMinimum, setPriceMinimum] = useState<number>(0);
  const [priceMaximum, setPriceMaximum] = useState<number>(0);

  const handlePriceMinimumChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPriceMinimum(Number(e.target.value));
  };

  const handlePriceMaximumChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPriceMaximum(Number(e.target.value));
  };

  useEffect(() => {
    setPriceMinimum(productQuery.priceMinimum);
  }, [productQuery.priceMinimum]);

  useEffect(() => {
    setPriceMaximum(productQuery.priceMaximum);
  }, [productQuery.priceMaximum]);

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
    setPriceMinimum(Number(target.priceMinimum.value));
    setPriceMaximum(Number(target.priceMaximum.value));
  };

  const handleFilterRating = (e: ChangeEvent<HTMLInputElement>) => {
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

  const [search, setSearch] = useState<string>('');

  const handleCitySearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setCityQuery({
      ...cityQuery,
      search: search,
    });
  };

  const handleCitySearchClick = () => {
    setCityQuery({
      ...cityQuery,
      search: search,
    });
  };

  const handleCategoryClick = (id: number, name: string) => {
    setProductQuery({
      ...productQuery,
      categoryID: id,
    });

    setCategoryFilter({
      id: id,
      name: name,
    });
  };

  return (
    <>
      <div
        className='absolute top-0 -left-full w-screen h-screen bg-base-200 shadow-md z-40 ease-in-out duration-300 md:relative md:w-auto md:h-auto md:top-0 md:left-0 md:rounded-lg md:z-0'
        id='filter-sidebar'
      >
        <div className='w-full py-4 flex justify-center items-center gap-2 text-lg font-bold'>
          <IoFilter />
          <h5>FILTER</h5>
        </div>
        <Divider className='m-0' />
        <Collapse checkbox icon='arrow' className='border-b-2 border-base-200'>
          <Collapse.Title className='font-bold'>Price</Collapse.Title>
          <Collapse.Content>
            <Form onSubmit={handleSubmitFilterPrice}>
              <Form.Label title='Min'>
                <InputGroup className='ml-2'>
                  <span className='text-sm font-bold'>Rp</span>
                  <Input
                    name='priceMinimum'
                    type='text'
                    className='w-full focus:border-primary text-sm'
                    value={priceMinimum || ''}
                    placeholder='Price Minimum'
                    onChange={handlePriceMinimumChange}
                    onKeyDown={handleNumberInvalidKey}
                  />
                </InputGroup>
              </Form.Label>
              <Form.Label title='Max'>
                <InputGroup className='ml-2'>
                  <span className='text-sm font-bold'>Rp</span>
                  <Input
                    name='priceMaximum'
                    type='text'
                    className='w-full focus:border-primary text-sm'
                    value={priceMaximum || ''}
                    placeholder='Price Maximum'
                    onChange={handlePriceMaximumChange}
                    onKeyDown={handleNumberInvalidKey}
                  />
                </InputGroup>
              </Form.Label>
              <Input type='submit' hidden />
            </Form>
          </Collapse.Content>
        </Collapse>
        <Divider className='m-0' />
        <Collapse checkbox icon='arrow' className='border-b-2 border-base-200'>
          <Collapse.Title className='font-bold'>Category</Collapse.Title>
          <Collapse.Content>
            <CategoryCollapse
              category={
                resGetAllCategory?.data ? resGetAllCategory.data : undefined
              }
              marginLeft={0}
              handleCategoryClick={handleCategoryClick}
            ></CategoryCollapse>
          </Collapse.Content>
        </Collapse>
        <Divider className='m-0' />
        <Collapse checkbox icon='arrow' className='border-b-2 border-base-200'>
          <Collapse.Title className='font-bold'>Rating</Collapse.Title>
          <Collapse.Content>
            <Form>
              <Form.Label title='⭐ 4 and above'>
                <Checkbox
                  name='rating'
                  value={4}
                  checked={!!productQuery.rating}
                  onChange={handleFilterRating}
                />
              </Form.Label>
            </Form>
          </Collapse.Content>
        </Collapse>
      </div>
      <Button
        className='fixed bottom-10 left-8 btn-circle text-xl drop-shadow-xl z-40 md:hidden'
        color='primary'
        onClick={handleClickFilterToggle}
      >
        <IoFilter />
      </Button>
    </>
  );
};

export default FilterSidebar;
