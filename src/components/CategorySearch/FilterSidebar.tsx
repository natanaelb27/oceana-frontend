import { ChangeEvent, FormEvent, Fragment, useEffect, useState } from 'react';
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
import { HiOutlineChevronDown, HiSearch } from 'react-icons/hi';
import { IoFilter } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { useGetAllCityQuery } from '../../store/services/cityService';
import { Category } from '../../types/component';
import { CityQuery, ProductQuery } from '../../types/query';
import { toCityQuery } from '../../utils/mapperDTO';
import { toUrl } from '../../utils/toUrl';
import { handleNumberInvalidKey } from '../../utils/validation';
import { FilterSidebarContainer } from './style';

type FilterSidebarProps = {
  productQuery: ProductQuery;
  setProductQuery: (query: ProductQuery) => void;
  category: Category[];
};

type OpenModal = {
  location: boolean;
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

  const [openModal, setOpenModal] = useState<OpenModal>({
    location: false,
  });

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

  const [locationChecked, setLocationChecked] = useState<string[]>([]);

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

  const [modalLocationChecked, setModalLocationChecked] = useState<string[]>(
    []
  );

  const handleModalFilterLocation = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target as typeof e.target & {
      location: { value: string };
    };

    let updatedList: string[] = [...modalLocationChecked];

    if (target.checked) {
      updatedList = [...modalLocationChecked, target.value];
    } else {
      updatedList.splice(modalLocationChecked.indexOf(target.value), 1);
    }

    setModalLocationChecked(updatedList);
  };

  const handleApplyLocationFilter = () => {
    setProductQuery({
      ...productQuery,
      merchantCities: modalLocationChecked,
    });

    setOpenModal({
      location: false,
    });

    setSearch('');

    setCityQuery({
      ...cityQuery,
      search: '',
    });
  };

  useEffect(() => {
    setLocationChecked(productQuery.merchantCities);
    setModalLocationChecked(productQuery.merchantCities);
  }, [productQuery.merchantCities]);

  const handleResetLocationFilter = () => {
    setModalLocationChecked([]);
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
    if (category?.at(0)?.category) {
      const data: boolean[] = [];
      category?.at(0)?.category.map(() => data.push(false));
      setSubSubCategoryCollapse(data);
    }
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

    setSearch('');

    setCityQuery({
      ...cityQuery,
      search: '',
    });

    setModalLocationChecked(productQuery.merchantCities);
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

  const arrLocation: string[] = [];
  for (const [, value] of Object.entries(resGetAllCity?.data || '')) {
    arrLocation.push(value.name);
  }

  return (
    <>
      <FilterSidebarContainer id='filter-sidebar'>
        <div className='w-full py-4 flex justify-center items-center gap-2 text-lg font-bold'>
          <IoFilter />
          <h5>FILTER</h5>
        </div>
        <Divider className='m-0' />

        {category?.at(0)?.category ? (
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
                          handleCategoryClick(
                            subCategory?.name,
                            subCategory?.id
                          );
                        }}
                      >
                        {subCategory?.name}
                      </span>
                      {subCategory?.category ? (
                        <HiOutlineChevronDown
                          className={`cursor-pointer transition-transform duration-300 ${
                            subSubCategoryCollapse.at(i) ? 'rotate-180' : ''
                          }`}
                          onClick={() => {
                            handleCollapseClick(i);
                          }}
                        />
                      ) : null}
                    </div>
                    {subCategory?.category ? (
                      <div
                        key={i}
                        className={`flex flex-col gap-2 mt-2 ${
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
                    ) : null}
                  </div>
                );
              })}
            </Collapse.Content>
          </Collapse>
        ) : (
          <Collapse open={false} className='border-b-2 border-base-200'>
            <Collapse.Title className='font-bold'>
              Category - <span>{category?.at(0)?.name}</span>
            </Collapse.Title>
            <Collapse.Content className='flex flex-col gap-5'></Collapse.Content>
          </Collapse>
        )}

        <Divider className='m-0'></Divider>
        <Collapse checkbox icon='arrow' className='border-b-2 border-base-200'>
          <Collapse.Title className='font-bold'>Location</Collapse.Title>
          <Collapse.Content>
            <Form>
              {resGetAllCityWithoutQuery?.data &&
                resGetAllCityWithoutQuery?.data?.slice(0, 5).map((city, i) => {
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
        className='md:max-w-2xl'
        onClickBackdrop={handleModalClose}
      >
        <Button
          size='sm'
          shape='circle'
          color='ghost'
          className='absolute right-2 top-2 md:hidden'
          onClick={handleModalClose}
        >
          <CgClose className='text-lg' />
        </Button>
        <Modal.Header className='flex items-center justify-between mb-0'>
          <div className='flex flex-col md:flex-row items-center gap-x-8 text-center'>
            <h1 className='font-bold'>Location</h1>
            <Form onSubmit={handleFormSubmit} className='w-full md:w-auto'>
              <InputGroup>
                <Input
                  type='text'
                  placeholder='Search...'
                  className='w-full md:max-w-xs'
                  value={search}
                  onChange={handleCitySearchChange}
                />
                <Button onClick={handleCitySearchClick}>
                  <HiSearch className='text-lg' />
                </Button>
              </InputGroup>
            </Form>
          </div>
          <Button
            size='sm'
            shape='circle'
            color='ghost'
            className='hidden md:flex'
            onClick={handleModalClose}
          >
            <CgClose className='text-lg' />
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Form className='grid grid-cols-2 md:grid-cols-3 gap-x-3'>
            {resGetAllCity?.data &&
              resGetAllCity?.data?.map((city, i) => {
                const currentFirstLetter = city.name.at(0);
                if (
                  i === 0 ||
                  arrLocation.at(i - 1)?.at(0) !== currentFirstLetter
                ) {
                  return (
                    <Fragment key={i}>
                      <div className='col-span-2 md:col-span-3 mt-5'>
                        <h1 className='text-xl font-bold'>
                          {currentFirstLetter}
                        </h1>
                      </div>
                      <Form.Label title={city.name} className='col-span-1 pl-0'>
                        <Checkbox
                          checked={modalLocationChecked.includes(
                            city.id.toString()
                          )}
                          value={city.id}
                          onChange={handleModalFilterLocation}
                        />
                      </Form.Label>
                    </Fragment>
                  );
                } else {
                  return (
                    <Form.Label
                      key={i}
                      title={city.name}
                      className='col-span-1 pl-0'
                    >
                      <Checkbox
                        checked={modalLocationChecked.includes(
                          city.id.toString()
                        )}
                        value={city.id}
                        onChange={handleModalFilterLocation}
                      />
                    </Form.Label>
                  );
                }
              })}
          </Form>
        </Modal.Body>
        <Modal.Actions className='flex gap-3'>
          <Button
            color='primary'
            className='btn-outline normal-case'
            onClick={handleResetLocationFilter}
          >
            Reset
          </Button>
          <Button
            color='primary'
            className='normal-case'
            onClick={handleApplyLocationFilter}
          >
            Apply
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default FilterSidebar;
