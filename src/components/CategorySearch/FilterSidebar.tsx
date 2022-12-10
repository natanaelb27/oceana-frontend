import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  Collapse,
  Divider,
  Form,
  Input,
  InputGroup,
  Modal,
} from 'react-daisyui';
import { CgClose } from 'react-icons/cg';
import {
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiSearch,
} from 'react-icons/hi';
import { IoFilter } from 'react-icons/io5';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useGetAllCityQuery } from '../../store/services/cityService';
import { Category } from '../../types/component';
import { CategoryQuery, ProductQuery } from '../../types/query';
import { GetAllCityResponse } from '../../types/response';
import { toCategoryQuery } from '../../utils/mapperDTO';
import { toUrl } from '../../utils/toUrl';
import { handleNumberInvalidKey } from '../../utils/validation';
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

type OpenModal = {
  location: boolean;
};

const FilterSidebar = ({
  productQuery,
  setProductQuery,
  category,
}: FilterSidebarProps) => {
  const [openModal, setOpenModal] = useState<OpenModal>({
    location: false,
  });

  const handleClickFilterToggle = () => {
    const filterSidebarEl = document.getElementById('filter-sidebar');
    filterSidebarEl?.classList.toggle('-left-full');
    filterSidebarEl?.classList.toggle('left-0');
    const productListSearchPageEl = document.getElementById(
      'product-list-search-page'
    );
    productListSearchPageEl?.classList.toggle('hidden');
  };

  const { data: resGetAllCity } = useGetAllCityQuery();

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

  const [locationChecked, setLocationChecked] = useState<string[]>([]);

  useEffect(() => {
    setLocationChecked(productQuery.merchantCities);
  }, [productQuery.merchantCities]);

  const handleFilterLocation = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target as typeof e.target & {
      location: { value: string };
    };

    let updatedList: string[] = [...locationChecked];

    if (target.checked) {
      updatedList = [...locationChecked, target.value];
    } else {
      updatedList.splice(locationChecked.indexOf(target.value), 1);
    }

    setLocationChecked(updatedList);

    setProductQuery({
      ...productQuery,
      merchantCities: updatedList,
    });
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

  const handleLocationLoadMoreClick = () => {
    setOpenModal({
      location: true,
    });
  };

  const handleModalClose = () => {
    setOpenModal({
      location: false,
    });
  };

  const [search, setSearch] = useState<string>('');

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSearch(search);
  };

  const handleSearchClick = () => {
    setSearch(search);
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
                          <span className='text-sm ml-2'>
                            {subSubCategory.name}
                          </span>
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
              {resGetAllCity?.data &&
                resGetAllCity?.data?.slice(0, 5).map((city, i) => {
                  return (
                    <Form.Label key={i} title={city.name}>
                      <Checkbox
                        value={city.id}
                        checked={locationChecked.includes(city.id.toString())}
                        onChange={handleFilterLocation}
                      />
                    </Form.Label>
                  );
                })}
              <span
                className='text-primary text-sm cursor-pointer mt-2'
                onClick={handleLocationLoadMoreClick}
              >
                Load more
              </span>
            </Form>
          </Collapse.Content>
        </Collapse>
        <Divider className='m-0'></Divider>
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
                    className='w-full focus:border-primary'
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
                    className='w-full focus:border-primary'
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
        <Divider className='m-0'></Divider>
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
      </FilterSidebarContainer>
      <Button
        className='fixed bottom-10 right-10 btn-circle text-xl drop-shadow-xl z-40 md:hidden'
        color='primary'
        onClick={handleClickFilterToggle}
      >
        <IoFilter />
      </Button>
      <Modal
        open={openModal.location}
        responsive
        className=''
        onClickBackdrop={handleModalClose}
      >
        <Button
          size='sm'
          shape='circle'
          color='ghost'
          className='absolute right-2 top-2'
          onClick={handleModalClose}
        >
          <CgClose className='text-lg' />
        </Button>
        <Modal.Header className='text-center font-bold flex flex-col md:flex-row items-center gap-3'>
          <h1>Location</h1>
          <Form onSubmit={handleFormSubmit} className='w-full md:w-auto'>
            <InputGroup>
              <Input
                type='text'
                placeholder='Search...'
                className='w-full md:max-w-xs'
                value={search}
                onChange={handleSearchChange}
              />
              <Button onClick={handleSearchClick}>
                <HiSearch className='text-lg' />
              </Button>
            </InputGroup>
          </Form>
        </Modal.Header>

        <Modal.Body>
          <Form className='grid grid-cols-2 gap-x-10'>
            {resGetAllCity?.data &&
              resGetAllCity?.data
                ?.filter(({ name }) =>
                  name.toLowerCase().includes(search.toLowerCase())
                )
                .map((city, i) => {
                  return (
                    <Form.Label
                      key={i}
                      title={city.name}
                      className='cols-span-1'
                    >
                      <Checkbox
                        checked={locationChecked.includes(city.id.toString())}
                        value={city.id}
                        onChange={handleFilterLocation}
                      />
                    </Form.Label>
                  );
                })}
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default FilterSidebar;
