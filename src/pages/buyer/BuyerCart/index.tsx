import React, { useEffect, useState } from 'react';
import { useGetUserCartQuery } from '../../../store/services/cartService';
import { GetUserCartResponse } from '../../../types/response';
import { notifyErrorToast } from '../../../utils/toast';
import { Divider, Input } from 'react-daisyui';
import { BiTrash } from 'react-icons/bi';
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from 'react-icons/ai';
import { titleCase } from '../../../utils/titleCase';

type SelectItem = {
  productID: number;
  selectItem: boolean;
  quantity: number;
};

type SelectMerchantItems = {
  merchantID: number;
  selectAll: boolean;
  selectItem: SelectItem[];
};

type SelectCartItems = {
  selectAll: boolean;
  selectItem: SelectMerchantItems[];
};

const BuyerCart = () => {
  const { data, error } = useGetUserCartQuery();
  const [selectedItems, setSelectedItems] = useState<SelectCartItems>({
    selectAll: false,
    selectItem: [],
  });

  if (error && 'data' in error) {
    const response = error.data as GetUserCartResponse;

    notifyErrorToast(response.message);
  }

  const dummyData = {
    data: [
      {
        merchant_id: 123,
        name: 'Test Shop 123',
        products: [
          {
            carts_id: '123',
            product_id: 1,
            product_item_id: '123120',
            product_name: 'test product 1',
            quantity: 1,
            price: 100000,
            price_after_discount: 9000,
          },
          {
            carts_id: '123',
            product_id: 2,
            product_item_id: '123120',
            product_name: 'test product 2',
            quantity: 1,
            price: 150000,
            price_after_discount: 9000,
          },
        ],
      },
      {
        merchant_id: 456,
        name: 'Test Shop 456',
        products: [
          {
            carts_id: '123',
            product_id: 3,
            product_item_id: '123120',
            product_name: 'test product 1',
            quantity: 1,
            price: 100000,
            price_after_discount: 9000,
          },
          {
            carts_id: '123',
            product_id: 4,
            product_item_id: '123120',
            product_name: 'test product 2',
            quantity: 1,
            price: 150000,
            price_after_discount: 9000,
          },
        ],
      },
    ],
    code: 200,
    error: null,
    message: 'sucess',
    metadata: null,
  };

  useEffect(() => {
    // if (!data?.data) return;
    const selectedMerchantItems: SelectMerchantItems[] = [];
    dummyData.data.forEach((value) => {
      const selectedItems: SelectItem[] = [];
      value.products.forEach((product) => {
        selectedItems.push({
          productID: product.product_id,
          selectItem: false,
          quantity: product.quantity,
        });
      });
      selectedMerchantItems.push({
        merchantID: value.merchant_id,
        selectAll: false,
        selectItem: selectedItems,
      });
    });

    setSelectedItems({
      selectAll: false,
      selectItem: selectedMerchantItems,
    });
  }, []);

  const handleClickAll = () => {
    const newSelectedItems = { ...selectedItems };
    newSelectedItems.selectItem.map((merchant) => {
      merchant.selectAll = false;
      merchant.selectItem = merchant.selectItem.map((product) => ({
        ...product,
        selectItem: false,
      }));
      return merchant;
    });
    newSelectedItems.selectAll = false;
    setSelectedItems(newSelectedItems);
    if (selectedItems.selectAll) {
      return;
    }
    const finalSelectedItems = { ...newSelectedItems };
    finalSelectedItems.selectItem.map((merchant) => {
      (merchant.selectAll = !merchant.selectAll),
        (merchant.selectItem = merchant.selectItem.map((product) => ({
          ...product,
          selectItem: !product.selectItem,
        })));
      return merchant;
    });
    finalSelectedItems.selectAll = !finalSelectedItems.selectAll;
    setSelectedItems(finalSelectedItems);
  };

  const handleClickMerchant = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    const merchantID = Number(target.parentElement?.parentElement?.id);
    const newSelectedItems = { ...selectedItems };
    let selectedMerchants = 0;
    newSelectedItems.selectItem.map((merchant) => {
      if (merchant.merchantID === merchantID) {
        merchant.selectAll = !merchant.selectAll;
        merchant.selectItem = merchant.selectItem.map((product) => ({
          ...product,
          selectItem: !product.selectItem,
        }));
      }
      if (merchant.selectAll) {
        selectedMerchants += 1;
      }
      return merchant;
    });
    if (newSelectedItems.selectItem.length === selectedMerchants) {
      newSelectedItems.selectAll = true;
    } else {
      newSelectedItems.selectAll = false;
    }
    setSelectedItems(newSelectedItems);
  };

  const handleClickProduct = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    const merchantID = Number(
      target.parentElement?.parentElement?.parentElement?.id
    );
    let selectedProducts = 0;
    const productID = Number(target.parentElement?.parentElement?.id);
    const newSelectedItems = { ...selectedItems };
    newSelectedItems.selectItem.map((merchant) => {
      if (merchant.merchantID === merchantID) {
        merchant.selectItem = merchant.selectItem.map((product) => {
          if (product.productID === productID) {
            product.selectItem = !product.selectItem;
          }
          if (product.selectItem) {
            selectedProducts += 1;
          }
          return product;
        });
        if (merchant.selectItem.length === selectedProducts) {
          merchant.selectAll = true;
        } else {
          merchant.selectAll = false;
        }
      }
      return merchant;
    });
    setSelectedItems(newSelectedItems);
  };

  return (
    <div className='px-2 container mx-auto flex flex-col'>
      <h5 className='font-bold text-2xl text-primary'>Cart</h5>
      <div className='flex'>
        <input
          type='checkbox'
          className='checkbox checkbox-success'
          onChange={handleClickAll}
          checked={selectedItems.selectAll}
        />{' '}
        <div className='pl-2'>Select All</div>
      </div>
      <Divider className='border-none' />
      {dummyData.data.map((merchant, merchantIndex) => (
        <div id={merchant.merchant_id.toString()} key={merchant.merchant_id}>
          <div className='flex items-center'>
            <input
              type='checkbox'
              className='checkbox checkbox-success'
              onChange={handleClickMerchant}
              checked={selectedItems?.selectItem[merchantIndex]?.selectAll}
            />
            <div className='flex flex-col pl-2'>
              <div className='font-bold'>{merchant.name}</div>
              <div className='text-xs'>Merchant Location</div>
            </div>
          </div>
          {merchant.products.map((product, productIndex) => {
            return (
              <div id={product.product_id.toString()} key={product.product_id}>
                <Divider className='m-0 p-0' />
                <div className='flex items-center py-3'>
                  <input
                    type='checkbox'
                    className='checkbox checkbox-success'
                    checked={
                      selectedItems?.selectItem[merchantIndex]?.selectItem[
                        productIndex
                      ]?.selectItem
                    }
                    onChange={handleClickProduct}
                  />
                  <div className='h-20 w-20 ml-2 mr-2 h-'>
                    <img
                      src='https://images.tokopedia.net/img/cache/100-square/product-1/2020/8/25/49295037/49295037_d63120b6-8ab4-4084-9765-a3b679ab18df_1000_1000.webp?ect=4g'
                      className='rounded-lg h-full w-full'
                    />
                  </div>
                  <div className='h-20 flex flex-col'>
                    <div className='justify-start'>
                      {titleCase(product.product_name)}
                    </div>
                    <div className='text-sm mt-0.5'>Test Product Variation</div>
                    <div className='text-base font-bold mt-3'>
                      Rp{product.price.toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>
                <div className='flex justify-end'>
                  <BiTrash size='1.5em' className='text-error mr-12' />
                  <AiOutlineMinusCircle size='1.5em' className='text-primary' />
                  <Input size='xs' className='w-12 border-primary' />
                  <AiOutlinePlusCircle size='1.5em' className='text-primary' />
                </div>
              </div>
            );
          })}
          <Divider />
        </div>
      ))}
    </div>
  );
};

export default BuyerCart;
