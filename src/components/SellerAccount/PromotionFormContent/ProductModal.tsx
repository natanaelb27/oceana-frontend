import { ChangeEvent, useEffect, useState } from 'react';
import { Button, Checkbox, Divider, Modal, Table } from 'react-daisyui';
import { CgClose } from 'react-icons/cg';
import { HiSearch } from 'react-icons/hi';
import { useGetCategoriesByMerchantIDQuery } from '../../../store/services/categoryService';
import { useGetAvailableProductsQuery } from '../../../store/services/productService';
import {
  ProductMerchantPromotionOption,
  SelectedProductMerchantPromotion,
} from '../../../types/component';
import { AvailableProductQuery } from '../../../types/query';
import { toRupiah } from '../../../utils/convert';
import { toAvailableProductQuery } from '../../../utils/mapperDTO';
import { Image, LoadingData, NoData } from '../../common';

type ProductModalProps = {
  open: boolean;
  products: SelectedProductMerchantPromotion;
  onClose: () => void;
  onConfirm: (newProducts: SelectedProductMerchantPromotion) => void;
  merchantID: string;
  startDate: Date | null;
  endDate: Date | null;
};

const ProductModal = ({
  open,
  products,
  onClose,
  onConfirm,
  merchantID,
  startDate,
  endDate,
}: ProductModalProps) => {
  const [search, setSearch] = useState<string>('');
  const [productQuery, setProductQuery] = useState<AvailableProductQuery>({
    search: '',
    filterCategory: 0,
    filterStartDatetime: new Date(),
    filterEndDatetime: new Date(),
  });
  const [
    selectedProductMerchantPromotion,
    setSelectedProductMerchantPromotion,
  ] = useState<SelectedProductMerchantPromotion>({});

  const { data: getCategoriesData, isFetching: getCategoriesDataIsFetching } =
    useGetCategoriesByMerchantIDQuery(merchantID || '');
  const { data: getProductsData, isFetching: getProductsDataIsFetching } =
    useGetAvailableProductsQuery(toAvailableProductQuery(productQuery));

  useEffect(() => {
    setSelectedProductMerchantPromotion(products);
    setProductQuery({
      ...productQuery,
      filterStartDatetime: startDate,
      filterEndDatetime: endDate,
    });
  }, [startDate, endDate]);

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setProductQuery({
      ...productQuery,
      search: search,
      filterCategory: Number(e.target.value),
    });
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSearchClick = () => {
    setProductQuery({
      ...productQuery,
      search: search,
    });
  };

  const handleProductCheckboxChange = (
    id: number,
    data: ProductMerchantPromotionOption
  ) => {
    if (selectedProductMerchantPromotion?.[id]) {
      const newSelectedProductMerchantPromotion = {
        ...selectedProductMerchantPromotion,
      };

      delete newSelectedProductMerchantPromotion?.[id];

      setSelectedProductMerchantPromotion(newSelectedProductMerchantPromotion);
    } else {
      setSelectedProductMerchantPromotion({
        ...selectedProductMerchantPromotion,
        [id]: data,
      });
    }
  };

  const handleAllCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!getProductsData?.data) {
      return;
    }

    const value = e.target.checked;
    let newSelectedProductMerchantPromotion = {
      ...selectedProductMerchantPromotion,
    };

    getProductsData.data.forEach(
      ({
        product_id,
        product_name,
        product_image,
        price_min,
        price_max,
        total_stock,
      }) => {
        if (!selectedProductMerchantPromotion?.[product_id] && value) {
          newSelectedProductMerchantPromotion = {
            ...newSelectedProductMerchantPromotion,
            [product_id]: {
              product_id: product_id,
              product_name: product_name,
              product_image: product_image,
              price_min: Number(price_min),
              price_max: Number(price_max),
              total_stock: Number(total_stock),
            },
          };
        } else if (selectedProductMerchantPromotion?.[product_id] && !value) {
          delete newSelectedProductMerchantPromotion?.[product_id];
        }
      }
    );

    setSelectedProductMerchantPromotion(newSelectedProductMerchantPromotion);
  };

  const handleClose = () => {
    setProductQuery({
      search: '',
      filterCategory: 0,
      filterStartDatetime: null,
      filterEndDatetime: null,
    });
    setSelectedProductMerchantPromotion({});

    onClose();
  };

  const handleConfirmClick = () => {
    onConfirm(selectedProductMerchantPromotion);
    handleClose();
  };

  const selectedAll = getProductsData?.data?.every(({ product_id }) =>
    Boolean(selectedProductMerchantPromotion?.[product_id])
  );

  return (
    <Modal open={open} onClickBackdrop={handleClose} className='max-w-2xl'>
      <Button
        size='sm'
        shape='circle'
        color='ghost'
        className='absolute right-2 top-2'
        onClick={handleClose}
      >
        <CgClose className='text-lg' />
      </Button>
      <Modal.Header className='text-center font-bold text-primary'>
        Choose Products
      </Modal.Header>
      <Modal.Body>
        <div className='grid grid-cols-12 gap-4 w-full'>
          <div className='col-span-12 md:col-span-6'>
            <label className='label'>
              <span className='label-text'>Category</span>
            </label>
            <select
              className='select w-full select-bordered'
              value={productQuery.filterCategory}
              onChange={handleCategoryChange}
            >
              <option value=''>All Category</option>
              {getCategoriesData?.data &&
                getCategoriesData.data.map(({ id, name }) => (
                  <option value={id} key={id}>
                    {name}
                  </option>
                ))}
            </select>
          </div>
          <div className='col-span-12 md:col-span-6'>
            <label className='label'>
              <span className='label-text'>Product Name</span>
            </label>
            <label className='input-group'>
              <input
                type='text'
                className='input input-bordered w-full'
                value={search}
                onChange={handleSearchChange}
              />
              <Button onClick={handleSearchClick}>
                <HiSearch className='text-xl' />
              </Button>
            </label>
          </div>
        </div>
        <Divider />
        <div className='overflow-x-auto overflow-y-auto max-h-48 md:max-h-96 mb-4'>
          {getProductsData?.data &&
          getProductsData.data.length > 0 &&
          !getProductsDataIsFetching ? (
            <Table className='w-[100%]'>
              <Table.Head>
                <span>
                  <Checkbox
                    checked={Boolean(selectedAll)}
                    onChange={handleAllCheckboxChange}
                  />
                </span>
                <span>Product</span>
                <span>Price</span>
              </Table.Head>
              <Table.Body>
                {getProductsData?.data &&
                  getProductsData.data.map(
                    ({
                      product_id,
                      product_name,
                      product_image,
                      price_max,
                      price_min,
                      total_stock,
                    }) => (
                      <Table.Row key={product_id}>
                        <div>
                          <Checkbox
                            checked={Boolean(
                              selectedProductMerchantPromotion?.[product_id]
                            )}
                            onChange={() =>
                              handleProductCheckboxChange(product_id, {
                                product_id: product_id,
                                product_name: product_name,
                                product_image: product_image,
                                price_max: Number(price_max),
                                price_min: Number(price_min),
                                total_stock: Number(total_stock),
                              })
                            }
                          />
                        </div>
                        <div className='flex flex-row items-center gap-2'>
                          <Image
                            src={product_image}
                            alt={product_name}
                            className='h-16 w-16 rounded-box'
                          />
                          <div className='flex flex-col truncate'>
                            <span className='font-medium w-64 truncate'>
                              {product_name}
                            </span>
                            <span className='text-sm text-light w-64 truncate'>
                              Stock: {total_stock}
                            </span>
                          </div>
                        </div>
                        <div>
                          {price_min === price_max
                            ? toRupiah(Number(price_max))
                            : `${toRupiah(Number(price_min))} - ${toRupiah(
                                Number(price_max)
                              )}`}
                        </div>
                      </Table.Row>
                    )
                  )}
              </Table.Body>
            </Table>
          ) : getProductsDataIsFetching || getCategoriesDataIsFetching ? (
            <div className='h-full flex justify-center items-center'>
              <LoadingData />
            </div>
          ) : (
            <div className='h-full flex justify-center items-center'>
              <NoData
                title='No Products?'
                message='You should create new product first'
              />
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Actions>
        <Button type='button' onClick={handleClose}>
          Cancel
        </Button>
        <Button type='button' color='primary' onClick={handleConfirmClick}>
          Confirm
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default ProductModal;
