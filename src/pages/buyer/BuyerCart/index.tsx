import React, { useEffect, useState } from 'react';
import {
  useGetUserCartQuery,
  useUpdateUserCartMutation,
} from '../../../store/services/cartService';
import { GetUserCartResponse } from '../../../types/response';
import { notifyErrorToast, notifySuccessToast } from '../../../utils/toast';
import { Divider, Input, Modal, Alert } from 'react-daisyui';
import { BiTrash } from 'react-icons/bi';
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from 'react-icons/ai';
import { titleCase } from '../../../utils/titleCase';
import NoData from '../../../components/common/NoData';

type SelectItem = {
  productID: number;
  productItemID: number;
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

type ModalInformation = {
  open: boolean;
  merchantID: number;
  productItemID: number;
};

const BuyerCart = () => {
  const { data, error } = useGetUserCartQuery();
  const [updateUserCart, { isLoading }] = useUpdateUserCartMutation();
  const [selectedItems, setSelectedItems] = useState<SelectCartItems>({
    selectAll: false,
    selectItem: [],
  });
  const [modal, setModal] = useState<ModalInformation>({
    open: false,
    merchantID: 0,
    productItemID: 0,
  });

  if (error && 'data' in error) {
    const response = error.data as GetUserCartResponse;

    notifyErrorToast(response.message);
  }

  useEffect(() => {
    const selectedMerchantItems: SelectMerchantItems[] = [];
    if (!data?.data) {
      return;
    }
    data.data.forEach((value) => {
      const selectedItems: SelectItem[] = [];
      value.products.forEach((product) => {
        selectedItems.push({
          productID: product.product_id,
          productItemID: product.product_item_id,
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
  }, [data]);

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
        merchant.selectItem.forEach((product) => {
          if (product.selectItem === true) {
            product.selectItem = false;
          }
        });
        if (!merchant.selectAll === true) {
          return;
        }
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
    console.log({ newSelectedItems });
  };

  const handleClickProduct = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    const merchantID = Number(
      target.parentElement?.parentElement?.parentElement?.id
    );
    const productItemID = Number(target.parentElement?.parentElement?.id);
    let selectedProducts = 0;
    let selectedMerchants = 0;
    const newSelectedItems = { ...selectedItems };
    newSelectedItems.selectItem.map((merchant) => {
      if (merchant.merchantID === merchantID) {
        merchant.selectItem = merchant.selectItem.map((product) => {
          if (product.productItemID === productItemID) {
            product.selectItem = !product.selectItem;
            if (product.selectItem === false) {
              newSelectedItems.selectAll = false;
            }
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
    console.log({ newSelectedItems });
    setSelectedItems(newSelectedItems);
    selectedItems.selectItem.forEach((merchant) => {
      if (merchant.selectAll === true) {
        selectedMerchants += 1;
      }
    });
    if (selectedMerchants === selectedItems.selectItem.length) {
      const updatedSelectedItems = { ...selectedItems };
      updatedSelectedItems.selectAll = true;
      setSelectedItems(updatedSelectedItems);
    }
  };

  const handleClickAddQuantity = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    const newSelectedItems = { ...selectedItems };
    const merchantID = Number(
      target.parentElement?.parentElement?.parentElement?.id
    );
    const productItemID = Number(target.parentElement?.parentElement?.id);
    newSelectedItems.selectItem.map((merchant) => {
      if (merchant.merchantID === merchantID) {
        merchant.selectItem = merchant.selectItem.map((product) => {
          if (product.productItemID === productItemID) {
            product.quantity += 1;
            updateUserCart({
              product_item_id: product.productItemID,
              quantity: product.quantity,
            })
              .unwrap()
              .then(() => {
                notifySuccessToast('1 Item has been added to cart');
              })
              .catch((err) => {
                product.quantity -= 1;
                notifyErrorToast(err.data.message);
                console.error(err);
              });
          }
          return product;
        });
      }
      return merchant;
    });
    setSelectedItems(newSelectedItems);
  };

  const handleClickDecreaseQuantity = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    const newSelectedItems = { ...selectedItems };
    const merchantID = Number(
      target.parentElement?.parentElement?.parentElement?.id
    );
    const productItemID = Number(target.parentElement?.parentElement?.id);
    newSelectedItems.selectItem.map((merchant) => {
      if (merchant.merchantID === merchantID) {
        merchant.selectItem = merchant.selectItem.map((product) => {
          if (product.productItemID === productItemID) {
            if (product.quantity === 1) {
              setModal({
                open: true,
                merchantID: merchant.merchantID,
                productItemID: product.productItemID,
              });
            } else if (product.quantity > 1) {
              product.quantity -= 1;
              updateUserCart({
                product_item_id: product.productItemID,
                quantity: product.quantity,
              })
                .unwrap()
                .then(() => {
                  notifySuccessToast('1 Item has been removed from cart');
                })
                .catch((err) => {
                  notifyErrorToast(err.data.message);
                  console.error(err);
                });
            }
          }
          return product;
        });
      }
      return merchant;
    });
    setSelectedItems(newSelectedItems);
  };

  const handleChangeQuantity = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLTextAreaElement;
    const newSelectedItems = { ...selectedItems };
    const merchantID = Number(
      target.parentElement?.parentElement?.parentElement?.id
    );
    const productItemID = Number(target.parentElement?.parentElement?.id);
    const quantity = parseInt(target.value, 10);
    newSelectedItems.selectItem.map((merchant) => {
      if (merchant.merchantID === merchantID) {
        merchant.selectItem = merchant.selectItem.map((product) => {
          if (product.productItemID === productItemID) {
            product.quantity = quantity;
            setTimeout(() => {
              updateUserCart({
                product_item_id: product.productItemID,
                quantity: product.quantity,
              });
            }, 3000);
          }
          return product;
        });
      }
      return merchant;
    });
    setSelectedItems(newSelectedItems);
  };

  const handleClickDelete = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLTextAreaElement;
    const merchantID = Number(
      target.parentElement?.parentElement?.parentElement?.id
    );
    const productItemID = Number(target.parentElement?.parentElement?.id);
    setModal({
      open: true,
      merchantID: merchantID,
      productItemID: productItemID,
    });
  };

  const handleClickConfirmModal = () => {
    const newSelectedItems = { ...selectedItems };
    newSelectedItems.selectItem.map((merchant) => {
      if (merchant.merchantID === modal.merchantID) {
        merchant.selectItem = merchant.selectItem.map((product) => {
          if (product.productItemID === modal.productItemID) {
            product.quantity -= 1;
          }
          return product;
        });
      }
      return merchant;
    });
    setSelectedItems(newSelectedItems);
    updateUserCart({
      product_item_id: modal.productItemID,
      quantity: 0,
    })
      .unwrap()
      .then(() => {
        notifySuccessToast('Item was succesfully deleted from cart');
      })
      .catch((err) => {
        notifyErrorToast('Error deleting item from cart');
        console.error(err);
      })
      .finally(() => {
        setModal({
          open: false,
          merchantID: 0,
          productItemID: 0,
        });
      });
  };

  const handleClickOutsideModal = () => {
    setModal({
      open: false,
      merchantID: 0,
      productItemID: 0,
    });
  };

  if (!data?.data || data?.data?.length === 0) {
    return (
      <div className='py-10'>
        <NoData
          title='No items in cart'
          message='Please add to cart to view more items'
        />
      </div>
    );
  }

  return (
    <div className='px-2 container mx-auto flex flex-col'>
      <h5 className='font-bold text-2xl text-primary my-4'>Cart</h5>
      {/* <Alert className='bg-red-100 border-2 border-red-300 my-2'>
        :( There was 1 item that could not be processed
      </Alert> */}
      <div className='flex'>
        <input
          type='checkbox'
          className='checkbox checkbox-success'
          onChange={handleClickAll}
          checked={selectedItems?.selectAll || false}
        />{' '}
        <div className='pl-2'>Select All</div>
      </div>
      <Divider className='border-none' />
      {data.data.map((merchant, merchantIndex) => (
        <div id={merchant.merchant_id.toString()} key={merchant.merchant_id}>
          <div className='flex items-center'>
            <input
              type='checkbox'
              className='checkbox checkbox-success'
              onChange={handleClickMerchant}
              checked={
                selectedItems?.selectItem[merchantIndex]?.selectAll || false
              }
            />
            <div className='flex flex-col pl-2'>
              <div className='font-bold'>{merchant.name}</div>
              <div className='text-xs'>{merchant.merchant_province}</div>
            </div>
          </div>
          {merchant.products.map((product, productIndex) => {
            return (
              <div
                id={product.product_item_id.toString()}
                key={product.product_item_id}
              >
                <Divider className='m-0 p-0' />
                <div className='flex items-center py-3'>
                  <input
                    type='checkbox'
                    className='checkbox checkbox-success'
                    checked={
                      selectedItems?.selectItem[merchantIndex]?.selectItem[
                        productIndex
                      ]?.selectItem || false
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
                    <div className='text-sm mt-0.5'>
                      {titleCase(product.product_variation)}
                    </div>
                    <div className='text-base font-bold mt-3'>
                      Rp{product.price.toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>
                <div className='flex justify-end'>
                  <BiTrash
                    size='2em'
                    className='text-error mr-12 cursor-pointer'
                    onClick={handleClickDelete}
                  />
                  <AiOutlineMinusCircle
                    size='2em'
                    className='text-primary cursor-pointer'
                    onClick={handleClickDecreaseQuantity}
                  />
                  <Input
                    size='sm'
                    className='w-10 text-center border-2 border-primary'
                    value={
                      selectedItems?.selectItem[merchantIndex]?.selectItem[
                        productIndex
                      ]?.quantity || 0
                    }
                    onChange={handleChangeQuantity}
                  />
                  <AiOutlinePlusCircle
                    size='2em'
                    className='text-primary cursor-pointer'
                    onClick={handleClickAddQuantity}
                  />
                </div>
              </div>
            );
          })}
          <Divider />
          <Modal open={modal.open} onClickBackdrop={handleClickOutsideModal}>
            <div className='font-bold text-primary mb-2'>Warning</div>
            <div>
              Are you sure you want to delete this product from your cart?
            </div>
            <div className='modal-action'>
              <button
                className='btn bg-primary border-0'
                onClick={handleClickConfirmModal}
              >
                Confirm
              </button>
            </div>
          </Modal>
        </div>
      ))}
    </div>
  );
};

export default BuyerCart;
