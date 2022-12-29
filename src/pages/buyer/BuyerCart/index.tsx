import React, { useEffect, useState } from 'react';
import { Button, Divider, Input, Modal } from 'react-daisyui';
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from 'react-icons/ai';
import { BiTrash } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import NoData from '../../../components/common/NoData';
import {
  useGetUserCartQuery,
  useUpdateUserCartMutation,
} from '../../../store/services/cartService';
import { setCheckout } from '../../../store/slices/checkoutSlice';
import { useAppDispatch } from '../../../store/store';
import { CartGroupedByMerchant, CartProduct } from '../../../types/component';
import { GetUserCartResponse } from '../../../types/response';
import { toRupiah } from '../../../utils/convert';
import { titleCase } from '../../../utils/titleCase';
import { notifyErrorToast, notifySuccessToast } from '../../../utils/toast';
import { Image } from '../../../components/common';

type SelectItem = {
  productID: number;
  productItemID: number;
  selectItem: boolean;
  quantity: number;
  stockQuantity: number;
  product: CartProduct;
};

type SelectMerchantItems = {
  merchantID: number;
  selectAll: boolean;
  selectItems: SelectItem[];
  cartGroupedByMerchant: CartGroupedByMerchant;
};

type SelectCartItems = {
  selectAll: boolean;
  selectMerchantItems: SelectMerchantItems[];
  cartGroupedByMerchants: CartGroupedByMerchant[];
};

type ModalInformation = {
  open: boolean;
  merchantID: number;
  productItemID: number;
};

const BuyerCart = () => {
  const { data, error, isLoading } = useGetUserCartQuery();
  const [updateUserCart] = useUpdateUserCartMutation();
  const [selectedItems, setSelectedItems] = useState<SelectCartItems>({
    selectAll: false,
    selectMerchantItems: [],
    cartGroupedByMerchants: [],
  });
  const [modal, setModal] = useState<ModalInformation>({
    open: false,
    merchantID: 0,
    productItemID: 0,
  });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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
          stockQuantity: product.stock_quantity,
          product,
        });
      });
      selectedMerchantItems.push({
        merchantID: value.merchant_id,
        selectAll: false,
        selectItems: selectedItems,
        cartGroupedByMerchant: value,
      });
    });

    setSelectedItems({
      selectAll: false,
      selectMerchantItems: selectedMerchantItems,
      cartGroupedByMerchants: data.data,
    });
  }, [data]);

  const handleClickAll = () => {
    const newSelectedItems = { ...selectedItems };
    newSelectedItems.selectMerchantItems.map((merchant) => {
      merchant.selectAll = false;
      merchant.selectItems = merchant.selectItems.map((product) => ({
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
    finalSelectedItems.selectMerchantItems.map((merchant) => {
      (merchant.selectAll = !merchant.selectAll),
        (merchant.selectItems = merchant.selectItems.map((product) => ({
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
    newSelectedItems.selectMerchantItems.map((merchant) => {
      if (merchant.merchantID === merchantID) {
        merchant.selectAll = !merchant.selectAll;
        merchant.selectItems.forEach((product) => {
          if (product.selectItem === true) {
            product.selectItem = false;
          }
        });
        if (!merchant.selectAll === true) {
          return;
        }
        merchant.selectItems = merchant.selectItems.map((product) => ({
          ...product,
          selectItem: !product.selectItem,
        }));
      }
      if (merchant.selectAll) {
        selectedMerchants += 1;
      }
      return merchant;
    });
    if (newSelectedItems.selectMerchantItems.length === selectedMerchants) {
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
    const productItemID = Number(target.parentElement?.parentElement?.id);
    let selectedProducts = 0;
    let selectedMerchants = 0;
    const newSelectedItems = { ...selectedItems };
    newSelectedItems.selectMerchantItems.map((merchant) => {
      if (merchant.merchantID === merchantID) {
        merchant.selectItems = merchant.selectItems.map((product) => {
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
        if (merchant.selectItems.length === selectedProducts) {
          merchant.selectAll = true;
        } else {
          merchant.selectAll = false;
        }
      }
      return merchant;
    });
    setSelectedItems(newSelectedItems);
    selectedItems.selectMerchantItems.forEach((merchant) => {
      if (merchant.selectAll === true) {
        selectedMerchants += 1;
      }
    });
    if (selectedMerchants === selectedItems.selectMerchantItems.length) {
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
    newSelectedItems.selectMerchantItems.map((merchant) => {
      if (merchant.merchantID === merchantID) {
        merchant.selectItems = merchant.selectItems.map((product) => {
          if (product.productItemID === productItemID) {
            product.quantity += 1;
            updateUserCart({
              product_item_id: product.productItemID,
              quantity: product.quantity,
            })
              .unwrap()
              .catch(() => {
                product.quantity = product.stockQuantity;
                notifyErrorToast('Your quantity is over the available stock!');
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
    newSelectedItems.selectMerchantItems.map((merchant) => {
      if (merchant.merchantID === merchantID) {
        merchant.selectItems = merchant.selectItems.map((product) => {
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
                .catch((err) => {
                  notifyErrorToast(err.data.message);
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
    newSelectedItems.selectMerchantItems.map((merchant) => {
      if (merchant.merchantID === merchantID) {
        merchant.selectItems = merchant.selectItems.map((product) => {
          if (product.productItemID === productItemID) {
            product.quantity = quantity;
          }
          return product;
        });
      }
      return merchant;
    });
    setSelectedItems(newSelectedItems);
  };

  const handleKeyUpQuantity = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLTextAreaElement;
    const newSelectedItems = { ...selectedItems };
    const merchantID = Number(
      target.parentElement?.parentElement?.parentElement?.id
    );
    const productItemID = Number(target.parentElement?.parentElement?.id);
    newSelectedItems.selectMerchantItems.map((merchant) => {
      if (merchant.merchantID === merchantID) {
        merchant.selectItems = merchant.selectItems.map((product) => {
          if (product.productItemID === productItemID) {
            setTimeout(() => {
              updateUserCart({
                product_item_id: product.productItemID,
                quantity: product.quantity,
              })
                .unwrap()
                .catch(() => {
                  notifyErrorToast(
                    'Your quantity is over the available stock!'
                  );
                  product.quantity = product.stockQuantity;
                });
            }, 100);
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
    newSelectedItems.selectMerchantItems.map((merchant) => {
      if (merchant.merchantID === modal.merchantID) {
        merchant.selectItems = merchant.selectItems.map((product) => {
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
        notifySuccessToast('Product was successfully deleted from your cart');
      })
      .catch(() => {
        notifyErrorToast('Error deleting product from cart');
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

  const handleClickCheckout = () => {
    if (!data?.data) return;

    let cartGroupedByMerchants: CartGroupedByMerchant[] = [];

    if (selectedItems.selectAll) {
      cartGroupedByMerchants = selectedItems.cartGroupedByMerchants;
      dispatch(setCheckout({ cartGroupedByMerchants }));
      navigate('/checkout');
      return;
    }

    // loop through merchants
    selectedItems.selectMerchantItems.forEach((selectMerchantItem) => {
      // all products from a merchant is selected
      if (selectMerchantItem.selectAll) {
        cartGroupedByMerchants.push(selectMerchantItem.cartGroupedByMerchant);
      } else {
        // loop through products in the merchant
        const productsGroupedByMerchant: CartGroupedByMerchant = {
          merchant_id: selectMerchantItem.cartGroupedByMerchant.merchant_id,
          merchant_province:
            selectMerchantItem.cartGroupedByMerchant.merchant_province,
          city_id: selectMerchantItem.cartGroupedByMerchant.city_id,
          name: selectMerchantItem.cartGroupedByMerchant.name,
          products: [],
        };
        selectMerchantItem.selectItems.forEach((selectItem) => {
          if (selectItem.selectItem) {
            productsGroupedByMerchant.products.push(selectItem.product);
          }
        });
        if (productsGroupedByMerchant.products.length !== 0) {
          cartGroupedByMerchants.push(productsGroupedByMerchant);
        }
      }
    });

    if (cartGroupedByMerchants.length === 0) {
      notifyErrorToast('No products to checkout');
      return;
    }

    dispatch(setCheckout({ cartGroupedByMerchants }));
    navigate('/checkout');
  };

  if (isLoading) {
    return (
      <div className='container mx-auto animate-pulse py-10'>
        <div className='grid grid-col-12 gap-4 mb-10'>
          <div className='h-4 bg-base-200 rounded-full col-span-12 w-2/5 mb-1'></div>
          <div className='h-4 bg-base-200 rounded-full col-span-3'></div>
          <div className='h-4 bg-base-200 rounded-full col-span-9'></div>
          <div className='h-4 bg-base-200 rounded-full col-span-3'></div>
          <div className='h-4 bg-base-200 rounded-full col-span-9'></div>
          <div className='h-4 bg-base-200 rounded-full col-span-3'></div>
          <div className='h-4 bg-base-200 rounded-full col-span-9'></div>
        </div>
        <Divider />
        <div className='grid grid-col-12 gap-4 mb-10'>
          <div className='h-4 bg-base-200 rounded-full col-span-12 w-2/5 mb-1'></div>
          <div className='h-4 bg-base-200 rounded-full col-span-3'></div>
          <div className='h-4 bg-base-200 rounded-full col-span-9'></div>
          <div className='h-4 bg-base-200 rounded-full col-span-3'></div>
          <div className='h-4 bg-base-200 rounded-full col-span-9'></div>
          <div className='h-4 bg-base-200 rounded-full col-span-3'></div>
          <div className='h-4 bg-base-200 rounded-full col-span-9'></div>
        </div>
        <Divider />
        <div className='grid grid-col-12 gap-4 mb-10'>
          <div className='h-4 bg-base-200 rounded-full col-span-12 w-2/5 mb-1'></div>
          <div className='h-4 bg-base-200 rounded-full col-span-3'></div>
          <div className='h-4 bg-base-200 rounded-full col-span-9'></div>
          <div className='h-4 bg-base-200 rounded-full col-span-3'></div>
          <div className='h-4 bg-base-200 rounded-full col-span-9'></div>
          <div className='h-4 bg-base-200 rounded-full col-span-3'></div>
          <div className='h-4 bg-base-200 rounded-full col-span-9'></div>
        </div>
      </div>
    );
  }

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
    <div className='px-8 md:px-2 container mx-auto flex flex-col'>
      <h5 className='font-bold text-2xl text-primary my-4'>Cart</h5>
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
                selectedItems?.selectMerchantItems[merchantIndex]?.selectAll ||
                false
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
                      selectedItems?.selectMerchantItems[merchantIndex]
                        ?.selectItems[productIndex]?.selectItem || false
                    }
                    onChange={handleClickProduct}
                  />
                  <div className='h-20 w-20 md:h-24 md:w-24 ml-2 mr-2 h-'>
                    <Image
                      src={product.product_media_url}
                      className='rounded-lg h-full w-full'
                      alt='Cart Item'
                    />
                  </div>
                  <div className='h-24 flex flex-col'>
                    <div className='justify-start mt-2 md:mt-0'>
                      {titleCase(product.product_name)}
                    </div>
                    <div className='text-sm mt-0.5'>
                      {titleCase(product.product_variation)}
                    </div>
                    {product.price !== product.price_after_discount ? (
                      <div className='flex items-center'>
                        <div className='text-lg font-bold'>
                          {toRupiah(product.price_after_discount)}
                        </div>
                        <h5 className='text-base line-through ml-1'>
                          {toRupiah(product.price)}
                        </h5>
                      </div> // prevents looping
                    ) : (
                      <div className='text-lg font-bold'>
                        {toRupiah(product.price_after_discount)}
                      </div>
                    )}
                    {product.stock_quantity <= 5 &&
                    product.stock_quantity > 1 ? (
                      <div className='text-red-500 text-sm'>
                        Stock: Only {product.stock_quantity} left!
                      </div>
                    ) : (
                      product.stock_quantity === 1 && (
                        <div className='text-red-500 text-sm'>
                          Last item, check out now!
                        </div>
                      )
                    )}
                  </div>
                </div>
                <div className='flex items-center justify-end gap-1'>
                  <Button
                    onClick={handleClickDelete}
                    className='btn-ghost text-red-500'
                    endIcon={
                      <BiTrash
                        pointerEvents={'none'}
                        size='1.25em'
                        className='pointer-events-none'
                      />
                    }
                    size='sm'
                  >
                    DELETE
                  </Button>
                  <Button
                    className='btn-ghost'
                    onClick={handleClickDecreaseQuantity}
                    shape='circle'
                    size='sm'
                  >
                    <AiOutlineMinusCircle
                      size={'2em'}
                      className='text-primary pointer-events-none'
                      pointerEvents={'none'}
                    />
                  </Button>

                  <Input
                    size='sm'
                    className='w-14 text-center border-2 border-primary'
                    value={
                      selectedItems?.selectMerchantItems[merchantIndex]
                        ?.selectItems[productIndex]?.quantity || 0
                    }
                    onChange={handleChangeQuantity}
                    onBlur={handleKeyUpQuantity}
                  />
                  <Button
                    className='btn-ghost'
                    onClick={handleClickAddQuantity}
                    shape='circle'
                    size='sm'
                  >
                    <AiOutlinePlusCircle
                      size='2em'
                      className='text-primary pointer-events-none'
                      pointerEvents={'none'}
                    />
                  </Button>
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
      <div className='my-10 md:flex md:justify-end'>
        <Button
          className='px-10 w-full md:w-auto'
          color='primary'
          onClick={handleClickCheckout}
        >
          Checkout
        </Button>
      </div>
    </div>
  );
};

export default BuyerCart;
