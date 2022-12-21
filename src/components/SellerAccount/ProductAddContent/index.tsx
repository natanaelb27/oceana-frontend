import { getIn, useFormik } from 'formik';
import React, { useState } from 'react';
import {
  Button,
  Card,
  Form,
  Input,
  InputGroup,
  Radio,
  Textarea,
  Toggle,
} from 'react-daisyui';
import { BiPlus } from 'react-icons/bi';
import { CgTrashEmpty } from 'react-icons/cg';
import * as Yup from 'yup';
import {
  PRODCUT_CONDITION_TYPE,
  PRODCUT_IS_HAZARDOUS_STATUS,
} from '../../../constants';
import { useLazyGetAncestorsCategoryQuery } from '../../../store/services/categoryService';
import { useCreateProductUpsertModelMutation } from '../../../store/services/productService';
import {
  PUMProduct,
  PUMProductItem,
  PUMVariant,
} from '../../../types/component/product';
import {
  CreateProductResponse,
  GetAncestorsCategoryResponse,
} from '../../../types/response';
import { notifyErrorToast, notifySuccessToast } from '../../../utils/toast';
import { handleNumberInvalidKey } from '../../../utils/validation';
import { formikPreorderDay } from '../../../utils/yupValidation';
import SectionHeading from '../../common/SectionHeading/index';
import { Action, ButtonAddMore } from './Button';
import CategoryModal from './CategoryModal';
import { Label } from './Form';
import * as FormLayout from './FormLayout';
import * as ProductVariantLayout from './ProductVariantLayout';

const ProductAddContent = () => {
  const [createProduct, { isLoading: createProductIsLoading }] =
    useCreateProductUpsertModelMutation();
  const [getAncestorsCategory] = useLazyGetAncestorsCategoryQuery();

  const productFormik = useFormik({
    initialValues: {
      id: 0,
      name: '',
      description: '',
      category_id: 0,
      category_name: 'Choose a category...',
      merchant_id: 0,
      weight: 0,
      is_hazardous: false,
      package_size: '',
      package_size_length: 0,
      package_size_width: 0,
      package_size_height: 0,
      condition: PRODCUT_CONDITION_TYPE.NEW,
      status: '',
      process_day: 2,
      preorder_day: 0,
      images: [],
      videos: [],
      product_items: [
        {
          id: 0,
          sku: '1M1P1CRSM',
          variant_index: [0, 0],
          price: 20000,
          stock_quantity: 1,
        },
        {
          id: 0,
          sku: '2M1P1CRSM',
          variant_index: [0, 1],
          price: 22000,
          stock_quantity: 2,
        },
        {
          id: 0,
          sku: '2M1P1CRSM',
          variant_index: [0, 2],
          price: 22000,
          stock_quantity: 3,
        },
        {
          id: 0,
          sku: '3M1P1CRSM',
          variant_index: [1, 0],
          price: 21000,
          stock_quantity: 4,
        },
        {
          id: 0,
          sku: '4M1P1CRSM',
          variant_index: [1, 1],
          price: 23000,
          stock_quantity: 5,
        },
        {
          id: 0,
          sku: '4M1P1CRSM',
          variant_index: [1, 2],
          price: 23000,
          stock_quantity: 6,
        },
      ],
      variants: [
        {
          name: 'Color',
          options: ['Red', 'Blue'],
          images: ['red.jpg', 'blue.jpg'],
        },
        {
          name: 'Size',
          options: ['S', 'M', 'L'],
          images: [],
        },
      ],
      couriers: [],
    },
    validationSchema: Yup.object({
      // id: Yup.number().required('Please enter id'),
      name: Yup.string().required('Please enter name').min(3),
      description: Yup.string().required('Please enter description'),
      category_id: Yup.number().required('Please enter category_id'),
      // merchant_id: Yup.number().required('Please enter merchant_id'),
      weight: Yup.number().required('Please enter weight').min(1),
      // is_hazardous: Yup.boolean().required('Please enter is hazardous'),
      // package_size: Yup.string().required('Please enter package_size'),
      package_size_length: Yup.number()
        .min(0, 'length must be between 10 to 1000')
        .max(1000, 'length must be between 10 to 1000')
        .label('length')
        .positive(),
      package_size_width: Yup.number()
        .min(0, 'length must be between 10 to 1000')
        .max(1000, 'length must be between 10 to 1000'),
      package_size_height: Yup.number()
        .min(0, 'length must be between 10 to 1000')
        .max(1000, 'length must be between 10 to 1000'),
      // condition: Yup.string().required('Please enter condition'),
      // status: Yup.string().required('Please enter status'),
      process_day: Yup.number().required('Please enter process_day'),
      preorder_day: Yup.number().test('preorder_day', (value, ctx) =>
        formikPreorderDay(ctx, value)
      ),
      // images: Yup.array().of(Yup.string().required('Please enter images')),
      // videos: Yup.array().of(Yup.string().required('Please enter videos')),
      product_items: Yup.array().of(
        Yup.object().shape({
          id: Yup.number().required('Please enter id'),
          sku: Yup.string().required('Please enter sku'),
          variant_index: Yup.array().required('Please enter variant index'),
          price: Yup.number()
            .required('Please enter price')
            .min(1)
            .max(1000000000)
            .label('price'),
          stock_quantity: Yup.number()
            .required('Please enter stock quantity')
            .min(1)
            .max(10000)
            .label('stock'),
        })
      ),
      variants: Yup.array().of(
        Yup.object().shape({
          name: Yup.string().required('Please enter variants name'),
          options: Yup.array().of(
            Yup.string().required('Please enter option name')
          ),
          // images: Yup.string(),
        })
      ),
      // couriers: [],
    }),
    onSubmit: (values) => {
      values.package_size = '500';
      createProduct({
        merchantID: values.merchant_id,
        request: values,
      })
        .unwrap()
        .then(() => {
          notifySuccessToast('Shipment has been updated!');
        })
        .catch((err) => {
          if ('data' in err) {
            const response = err.data as CreateProductResponse;

            notifyErrorToast(response.message);
          }
        })
        .finally();
      return;
    },
  });

  const [openCategoryModal, setOpenCategoryModal] = useState(false);

  const handlePreorderToggleOnChange = () => {
    if (productFormik.values.process_day == 2) {
      productFormik.setFieldValue('process_day', 0);
      productFormik.setFieldValue('preorder_day', 7);
    } else {
      productFormik.setFieldValue('process_day', 2);
      productFormik.setFieldValue('preorder_day', 0);
    }
  };

  const deepCopyVariants = (data: PUMVariant[]) => {
    return data ? (JSON.parse(JSON.stringify(data)) as typeof data) : null;
  };

  const deepCopy = (data: any[]) => {
    return data ? (JSON.parse(JSON.stringify(data)) as typeof data) : null;
  };

  const handleAddVariantOnClick = () => {
    if (productFormik.values.variants.length === 2) {
      return;
    }

    let newData = deepCopyVariants(productFormik.values.variants);

    if (newData === null) {
      newData = [];
    }

    const newVariant: PUMVariant = {
      name: '',
      images: [],
      options: [''],
    };

    newData.push(newVariant);

    updateProductItemsAccordingToVariants(newData);

    productFormik.setFieldValue('variants', newData);
  };

  const handleAddOptionOnClick = (indexVariant: number) => {
    let newData = deepCopyVariants(productFormik.values.variants);

    if (newData === null) {
      newData = [];
    }

    const newOption = '';

    newData[indexVariant].options.push(newOption);

    updateProductItemsAccordingToVariants(newData);

    productFormik.setFieldValue('variants', newData);
  };

  const newPUMProductItem = (): PUMProductItem => {
    return {
      id: 0,
      price: 0,
      sku: '',
      stock_quantity: 0,
      variant_index: [],
    };
  };
  console.log(productFormik.values.product_items);
  const combineAll = (array: number[][]) => {
    const res: number[][] = [];
    const max = array.length - 1;
    const helper = (arr: number[], i: number) => {
      for (let j = 0, l = array[i].length; j < l; j++) {
        const copy = arr.slice(0);
        copy.push(array[i][j]);
        if (i == max) res.push(copy);
        else helper(copy, i + 1);
      }
    };
    helper([], 0);
    return res;
  };

  function arrayCompareWithoutSort<Type>(_arr1: Type[], _arr2: Type[]) {
    if (
      !Array.isArray(_arr1) ||
      !Array.isArray(_arr2) ||
      _arr1.length !== _arr2.length
    ) {
      return false;
    }

    const arr1 = _arr1.concat();
    const arr2 = _arr2.concat();

    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }

    return true;
  }

  const updateProductItemsAccordingToVariants = (variants: PUMVariant[]) => {
    const data = deepCopy(
      productFormik.values.product_items
    ) as PUMProductItem[];

    if (variants.length === 0) {
      productFormik.setFieldValue('product_items', []);
      return;
    }

    let newProductItems: PUMProductItem[] = [];
    // insert new product items according to new variants
    const optionsArray = variants.map((variant) => {
      return variant.options.map((_, indexOption) => indexOption);
    });

    // create variant indexes
    const newVariantIndexes = combineAll(optionsArray);

    // create new product items
    newProductItems = newVariantIndexes.map((variantIndex) => {
      let matchedProductItemIndex = -1;
      data.forEach((productItem, indexProductItem) => {
        if (
          arrayCompareWithoutSort<number>(
            productItem.variant_index,
            variantIndex
          )
        ) {
          matchedProductItemIndex = indexProductItem;
        }
      });

      if (matchedProductItemIndex !== -1) {
        return data[matchedProductItemIndex];
      }

      const newProductItem = newPUMProductItem();
      newProductItem.variant_index = variantIndex;
      return newProductItem;
    });

    productFormik.setFieldValue('product_items', newProductItems);
  };

  const handleDeleteVariantOnClick = (index: number) => {
    const newVariants = deepCopyVariants(productFormik.values.variants);

    if (index < 0 || newVariants === null) {
      return;
    }

    // delete variant
    newVariants.splice(index, 1);

    // delete product items
    updateProductItemsAccordingToVariants(newVariants);

    productFormik.setFieldValue('variants', newVariants);
  };

  const handleDeleteVariantOptionOnClick = (
    indexVariant: number,
    indexOption: number
  ) => {
    const newVariants = deepCopyVariants(productFormik.values.variants);

    if (indexVariant < 0 || indexOption < 0 || newVariants === null) {
      return;
    }

    // validate if options length is 1 then dont allow delete (show error)

    newVariants[indexVariant].options.splice(indexOption, 1);

    updateProductItemsAccordingToVariants(newVariants);

    productFormik.setFieldValue('variants', newVariants);
  };

  const handleIsHazardousOnChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value =
      e.target.value === PRODCUT_IS_HAZARDOUS_STATUS.TRUE ? true : false;
    productFormik.setFieldValue(e.target.name, value);
  };

  const handleConditionOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    productFormik.setFieldValue(e.target.name, value);
  };

  const handleCategoryOnClick = (id: number) => {
    let categoryNames = '';
    getAncestorsCategory(id.toString())
      .unwrap()
      .then((response: GetAncestorsCategoryResponse) => {
        const { data: ancestorsCategory } = response;
        ancestorsCategory?.map((v, i) => {
          categoryNames +=
            v.name + (i < ancestorsCategory.length - 1 ? ' > ' : '');
        });
      })
      .finally(() => {
        console.log(id);
        productFormik.setFieldValue('category_name', categoryNames);
        productFormik.setFieldValue('category_id', id);
        setOpenCategoryModal(false);
      });
  };

  const renderVariants = () => {
    // if(productFormik.values.variants.length>0){
    // }
    return (
      <div className='flex flex-col gap-3'>
        {
          // variants
          productFormik.values.variants.map((_, indexVariant) => (
            <div
              className='flex flex-col gap-2 bg-base-200 p-5'
              key={'variant-' + indexVariant}
            >
              <ProductVariantLayout.LabelInputErrorContainer>
                <ProductVariantLayout.LabelInputContainer>
                  <ProductVariantLayout.LabelContainer>
                    <Form.Label title={`Variants ${indexVariant + 1}`} />
                  </ProductVariantLayout.LabelContainer>
                  <ProductVariantLayout.InputContainer>
                    <Input
                      type='text'
                      name={`variants[${indexVariant}].name`}
                      className='w-full'
                      placeholder={'example: Color, etc.'}
                      value={productFormik.values.variants[indexVariant].name}
                      onChange={productFormik.handleChange}
                      onFocus={() =>
                        productFormik.setFieldTouched(
                          `variants[${indexVariant}].name`,
                          true
                        )
                      }
                    />
                  </ProductVariantLayout.InputContainer>
                  <ProductVariantLayout.ActionContainer>
                    <Action
                      onClick={() => handleDeleteVariantOnClick(indexVariant)}
                      icon={<CgTrashEmpty />}
                    />
                  </ProductVariantLayout.ActionContainer>
                </ProductVariantLayout.LabelInputContainer>
                <ProductVariantLayout.InputError>
                  {productFormik.touched.variants?.[indexVariant]?.name &&
                    getIn(
                      productFormik.errors.variants?.[indexVariant],
                      'name'
                    ) && (
                      <label className='label-text-alt text-error'>
                        {
                          // for alternative can also use type assertion : productFormik.errors.variants?.[indexVariant] ? (productFormik.errors.variants?.[indexVariant] as PUMVariant).name : ''
                          // https://github.com/jaredpalmer/formik/issues/2347#issuecomment-1167283908
                          getIn(
                            productFormik.errors.variants?.[indexVariant],
                            'name'
                          )
                        }
                      </label>
                    )}
                </ProductVariantLayout.InputError>
              </ProductVariantLayout.LabelInputErrorContainer>
              {
                // options
                productFormik.values.variants[indexVariant].options.map(
                  (_, indexOption) => {
                    return (
                      <ProductVariantLayout.LabelInputErrorContainer
                        key={
                          'variant-' + indexVariant + '-option-' + indexOption
                        }
                      >
                        <ProductVariantLayout.LabelInputContainer>
                          <ProductVariantLayout.LabelContainer>
                            {indexOption === 0 && (
                              <Form.Label title='Options' />
                            )}
                          </ProductVariantLayout.LabelContainer>
                          <ProductVariantLayout.InputContainer>
                            <Input
                              type='text'
                              name={`variants[${indexVariant}].options[${indexOption}]`}
                              className='w-full'
                              placeholder={'example: Red, etc.'}
                              value={
                                productFormik.values.variants[indexVariant]
                                  .options[indexOption]
                              }
                              onChange={productFormik.handleChange}
                              onFocus={() =>
                                productFormik.setFieldTouched(
                                  `variants[${indexVariant}].options[${indexOption}]`,
                                  true
                                )
                              }
                            />
                          </ProductVariantLayout.InputContainer>
                          <ProductVariantLayout.ActionContainer>
                            <Action
                              onClick={() =>
                                handleDeleteVariantOptionOnClick(
                                  indexVariant,
                                  indexOption
                                )
                              }
                              icon={<CgTrashEmpty />}
                              disabled={
                                productFormik.values.variants[indexVariant]
                                  .options.length < 2
                              }
                            />
                          </ProductVariantLayout.ActionContainer>
                        </ProductVariantLayout.LabelInputContainer>
                        <ProductVariantLayout.InputError>
                          {getIn(
                            productFormik.touched.variants?.[indexVariant],
                            'options'
                          )?.[indexOption] &&
                            getIn(
                              productFormik.errors.variants?.[indexVariant],
                              'options'
                            )?.[indexOption] && (
                              <div className='label-text-alt text-error'>
                                {
                                  getIn(
                                    productFormik.errors.variants?.[
                                      indexVariant
                                    ],
                                    'options'
                                  )?.[indexOption]
                                }
                              </div>
                            )}
                        </ProductVariantLayout.InputError>
                      </ProductVariantLayout.LabelInputErrorContainer>
                    );
                  }
                )
              }
              <ProductVariantLayout.ExtraInput>
                {
                  <ButtonAddMore
                    className='border-dashed border-black hover:border-primary bg-base-100 hover:bg-primary text-primary hover:bg-opacity '
                    onClick={() => handleAddOptionOnClick(indexVariant)}
                  >
                    <BiPlus className='text-2xl' /> Add Option{' '}
                    {productFormik.values.variants[indexVariant].options
                      .length + 1}
                  </ButtonAddMore>
                }
              </ProductVariantLayout.ExtraInput>
            </div>
          ))
        }
        {productFormik.values.variants.length < 2 && (
          <ButtonAddMore
            className='border-dashed border-black hover:border-primary bg-transparent hover:bg-primary text-primary hover:bg-opacity-10 '
            onClick={handleAddVariantOnClick}
          >
            <BiPlus className='text-2xl' /> Add Variant{' '}
            {productFormik.values.variants.length + 1}
          </ButtonAddMore>
        )}
      </div>
    );
  };

  const renderVariations = () => {
    // if(productFormik.values.variants.length>0){
    // }
    return (
      <div className='flex flex-col gap-3 overflow-auto'>
        <table className='table'>
          <thead>
            <tr>
              <th align='center'>Picture</th>
              {productFormik.values.variants.map(
                (valueVariant, indexVariant) => (
                  <th key={'variations-thead-' + indexVariant}>
                    {valueVariant.name}
                  </th>
                )
              )}
              <th align='center'>
                Price<span className='text-red-500'> *</span>
              </th>
              <th align='center'>
                Stock<span className='text-red-500'> *</span>
              </th>
              <th align='center'>SKU</th>
            </tr>
          </thead>
          <tbody>
            {productFormik.values.product_items.map(
              (valueProductItem, indexProductItem) => {
                return (
                  <tr key={'variations-tr-' + indexProductItem}>
                    {/* picture and options */}
                    {valueProductItem.variant_index.map(
                      (valueVariantIndex, indexVariantIndex) => {
                        // if not exist
                        if (
                          productFormik.values.variants?.[indexVariantIndex]
                            ?.options?.[valueVariantIndex] === undefined
                        ) {
                          return;
                        }

                        // if previous index exist then check if current variant index value is the same as previous value then true (do rowspan)
                        const rowSpanCondition =
                          indexProductItem - 1 >= 0
                            ? valueVariantIndex ===
                              productFormik.values.product_items[
                                indexProductItem - 1
                              ].variant_index[indexVariantIndex]
                            : false;
                        const rowSpanValue =
                          !rowSpanCondition &&
                          indexVariantIndex + 1 <
                            productFormik.values.variants.length
                            ? productFormik.values.variants[
                                indexVariantIndex + 1
                              ].options.length
                            : 1;

                        if (indexVariantIndex === 0 && rowSpanCondition) {
                          return;
                        }

                        return (
                          <React.Fragment
                            key={
                              'variations-tr-' +
                              indexProductItem +
                              '-variant-index-' +
                              indexVariantIndex +
                              '-' +
                              valueVariantIndex
                            }
                          >
                            {indexVariantIndex == 0 && (
                              // picture
                              <td
                                className='border border-base-300'
                                rowSpan={rowSpanValue}
                              >
                                -
                              </td>
                            )}
                            {/* Options */}
                            <td
                              className='border border-base-300'
                              rowSpan={rowSpanValue}
                            >
                              {
                                productFormik.values.variants[indexVariantIndex]
                                  .options[valueVariantIndex]
                              }
                            </td>
                          </React.Fragment>
                        );
                      }
                    )}
                    {/* input: price */}
                    <td className='border border-base-300 align-top'>
                      <div className='min-w-[10rem]'>
                        <div className='flex items-center gap-2'>
                          <InputGroup>
                            <span>Rp. </span>
                            <Input
                              type='number'
                              name={`product_items[${indexProductItem}].price`}
                              className='w-full'
                              value={
                                productFormik.values.product_items[
                                  indexProductItem
                                ].price
                              }
                              onChange={productFormik.handleChange}
                              onFocus={() => {
                                productFormik.setFieldTouched(
                                  `product_items[${indexProductItem}].price`,
                                  true
                                );
                              }}
                              onKeyDown={handleNumberInvalidKey}
                            />
                          </InputGroup>
                        </div>
                        {productFormik.touched.product_items?.[indexProductItem]
                          ?.price &&
                          getIn(
                            productFormik.errors.product_items?.[
                              indexProductItem
                            ],
                            'price'
                          ) && (
                            <label className='label-text-alt text-error'>
                              {getIn(
                                productFormik.errors.product_items?.[
                                  indexProductItem
                                ],
                                'price'
                              )}
                            </label>
                          )}
                      </div>
                    </td>
                    {/* input: stock_quantity */}
                    <td className='border border-base-300 align-top'>
                      <div className='min-w-[10rem]'>
                        <div className='flex items-center gap-2'>
                          <Input
                            type='number'
                            name={`product_items[${indexProductItem}].stock_quantity`}
                            className='w-full'
                            value={
                              productFormik.values.product_items[
                                indexProductItem
                              ].stock_quantity
                            }
                            onChange={productFormik.handleChange}
                            onFocus={() => {
                              productFormik.setFieldTouched(
                                `product_items[${indexProductItem}].stock_quantity`,
                                true
                              );
                            }}
                            onKeyDown={handleNumberInvalidKey}
                          />
                        </div>
                        {productFormik.touched.product_items?.[indexProductItem]
                          ?.stock_quantity &&
                          getIn(
                            productFormik.errors.product_items?.[
                              indexProductItem
                            ],
                            'stock_quantity'
                          ) && (
                            <label className='label-text-alt text-error'>
                              {getIn(
                                productFormik.errors.product_items?.[
                                  indexProductItem
                                ],
                                'stock_quantity'
                              )}
                            </label>
                          )}
                      </div>
                    </td>
                    {/* input: sku */}
                    <td className='border border-base-300 align-top'>
                      <div className='min-w-[10rem]'>
                        <div className='flex items-center gap-2'>
                          <Input
                            type='text'
                            name={`product_items[${indexProductItem}].sku`}
                            className='w-full'
                            value={
                              productFormik.values.product_items[
                                indexProductItem
                              ].sku
                            }
                            onChange={productFormik.handleChange}
                            onFocus={() => {
                              productFormik.setFieldTouched(
                                `product_items[${indexProductItem}].sku`,
                                true
                              );
                            }}
                          />
                        </div>
                        {productFormik.touched.product_items?.[indexProductItem]
                          ?.sku &&
                          getIn(
                            productFormik.errors.product_items?.[
                              indexProductItem
                            ],
                            'sku'
                          ) && (
                            <label className='label-text-alt text-error'>
                              {getIn(
                                productFormik.errors.product_items?.[
                                  indexProductItem
                                ],
                                'sku'
                              )}
                            </label>
                          )}
                      </div>
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      <Form
        id='addProductForm'
        className='flex flex-col gap-4 p-1 md:p-4 rounded-lg bg-base-200'
        onSubmit={(e) => {
          e.preventDefault();
          productFormik.handleSubmit();
        }}
      >
        {/* Product Information */}
        <Card className='shadow  bg-base-100'>
          <div className='flex flex-col gap-2 p-4 md:p-10'>
            <SectionHeading
              title='Product Information'
              description='Basic information about the product.'
            />
            {/* name */}
            <FormLayout.LabelInputErrorContainer>
              <FormLayout.LabelInputContainer>
                <FormLayout.LabelContainer>
                  <Label required={true}>Name</Label>
                </FormLayout.LabelContainer>
                <FormLayout.InputContainer>
                  <div className='flex items-center gap-2'>
                    <Input
                      type='text'
                      name='name'
                      className='w-full'
                      value={productFormik.values.name}
                      onChange={productFormik.handleChange}
                      onFocus={() => {
                        productFormik.touched.name = true;
                      }}
                    />
                  </div>
                </FormLayout.InputContainer>
              </FormLayout.LabelInputContainer>
              <FormLayout.InputError>
                {productFormik.touched.name && productFormik.errors.name && (
                  <label className='label-text-alt text-error'>
                    {productFormik.errors.name}
                  </label>
                )}
              </FormLayout.InputError>
            </FormLayout.LabelInputErrorContainer>
            {/* input: category */}
            <FormLayout.LabelInputErrorContainer>
              <FormLayout.LabelInputContainer>
                <FormLayout.LabelContainer>
                  <Label required={true}>Category</Label>
                </FormLayout.LabelContainer>
                <FormLayout.InputContainer>
                  <div className='flex items-center gap-2'>
                    <div
                      className='w-full flex justify-start cursor-pointer textarea textarea-bordered border-2 rounded-lg'
                      onFocus={() => (productFormik.touched.category_id = true)}
                      onClick={() => {
                        setOpenCategoryModal(true);
                      }}
                    >
                      {productFormik.values.category_name}
                    </div>
                  </div>
                </FormLayout.InputContainer>
              </FormLayout.LabelInputContainer>
              <FormLayout.InputError>
                {productFormik.touched.category_id &&
                  productFormik.errors.category_id && (
                    <label className='label-text-alt text-error'>
                      {productFormik.errors.category_id}
                    </label>
                  )}
              </FormLayout.InputError>
            </FormLayout.LabelInputErrorContainer>{' '}
            {/* todos: photo upload */}
          </div>
        </Card>
        {/* Product Detail */}
        <Card className='shadow bg-base-100'>
          <div className='flex flex-col gap-2 p-4 md:p-10'>
            <SectionHeading
              title='Product Detail'
              description='Detailed information about the product.'
            />
            {/* input: description */}
            <FormLayout.LabelInputErrorContainer>
              <FormLayout.LabelInputContainer>
                <FormLayout.LabelContainer justify='justify-start'>
                  <Label required={true}>Description</Label>
                </FormLayout.LabelContainer>
                <FormLayout.InputContainer>
                  <div className='flex items-center gap-2'>
                    <Textarea
                      name='description'
                      className='w-full'
                      value={productFormik.values.description}
                      onChange={productFormik.handleChange}
                      onFocus={() => (productFormik.touched.description = true)}
                    />
                  </div>
                </FormLayout.InputContainer>
              </FormLayout.LabelInputContainer>
              <FormLayout.InputError>
                {productFormik.touched.description &&
                  productFormik.errors.description && (
                    <label className='label-text-alt text-error'>
                      {productFormik.errors.description}
                    </label>
                  )}
              </FormLayout.InputError>
            </FormLayout.LabelInputErrorContainer>
            {/* input: condition */}
            <FormLayout.LabelInputErrorContainer>
              <FormLayout.LabelInputContainer>
                <FormLayout.LabelContainer justify='justify-start'>
                  <Label required={true}>Condition</Label>
                </FormLayout.LabelContainer>
                <FormLayout.InputContainer>
                  <div className='flex items-center gap-2'>
                    <label className='flex flex-row gap-2 items-center cursor-pointer'>
                      <Radio
                        size='sm'
                        color='primary'
                        name='condition'
                        value={PRODCUT_CONDITION_TYPE.NEW}
                        checked={
                          productFormik.values.condition ===
                          PRODCUT_CONDITION_TYPE.NEW
                        }
                        onChange={handleConditionOnChange}
                      />
                      <span className='text-sm'>New</span>
                    </label>
                    <label className='flex flex-row gap-2 items-center cursor-pointer'>
                      <Radio
                        size='sm'
                        color='primary'
                        name='condition'
                        value={PRODCUT_CONDITION_TYPE.USED}
                        checked={
                          productFormik.values.condition ===
                          PRODCUT_CONDITION_TYPE.USED
                        }
                        onChange={handleConditionOnChange}
                      />
                      <span className='text-sm'>Used</span>
                    </label>
                  </div>
                </FormLayout.InputContainer>
              </FormLayout.LabelInputContainer>
              <FormLayout.InputError>
                {productFormik.touched.condition &&
                  productFormik.errors.condition && (
                    <label className='label-text-alt text-error'>
                      {productFormik.errors.condition}
                    </label>
                  )}
              </FormLayout.InputError>
            </FormLayout.LabelInputErrorContainer>
            {/* input: is hazardous */}
            <FormLayout.LabelInputErrorContainer>
              <FormLayout.LabelInputContainer>
                <FormLayout.LabelContainer justify='justify-start'>
                  <Label required={true}>Product Is Hazardous</Label>
                </FormLayout.LabelContainer>
                <FormLayout.InputContainer>
                  <div className='flex items-center gap-2'>
                    <label className='flex flex-row gap-2 items-center cursor-pointer'>
                      <Radio
                        size='sm'
                        color='primary'
                        name='is_hazardous'
                        value={PRODCUT_IS_HAZARDOUS_STATUS.FALSE}
                        checked={!productFormik.values.is_hazardous}
                        onChange={handleIsHazardousOnChange}
                      />
                      <span className='text-sm'>No</span>
                    </label>
                    <label className='flex flex-row gap-2 items-center cursor-pointer'>
                      <Radio
                        size='sm'
                        color='primary'
                        name='is_hazardous'
                        value={PRODCUT_IS_HAZARDOUS_STATUS.TRUE}
                        checked={productFormik.values.is_hazardous}
                        onChange={handleIsHazardousOnChange}
                      />
                      <span className='text-sm'>
                        Contains hazardous materials (example:
                        batteries/magnets/liquids/flammable/etc)
                      </span>
                    </label>
                  </div>
                </FormLayout.InputContainer>
              </FormLayout.LabelInputContainer>
              <FormLayout.InputError>
                {productFormik.touched.is_hazardous &&
                  productFormik.errors.is_hazardous && (
                    <label className='label-text-alt text-error'>
                      {productFormik.errors.is_hazardous}
                    </label>
                  )}
              </FormLayout.InputError>
            </FormLayout.LabelInputErrorContainer>
          </div>
        </Card>
        {/* show if variants length > 0 */}
        <Card className='shadow bg-base-100'>
          <div className='flex flex-col gap-2 p-4 md:p-10'>
            <SectionHeading
              title='Product Variant'
              description='Manage the product.'
            />
            {/* input: product variant */}
            <FormLayout.LabelInputContainer>
              <FormLayout.LabelContainer justify='justify-start'>
                <Label>Variants</Label>
              </FormLayout.LabelContainer>
              <FormLayout.InputContainer>
                {renderVariants()}
              </FormLayout.InputContainer>
            </FormLayout.LabelInputContainer>
            {/* input: product variations */}
            <FormLayout.LabelInputContainer>
              <FormLayout.LabelContainer justify='justify-start'>
                <Label>Variations</Label>
              </FormLayout.LabelContainer>
              <FormLayout.InputContainer>
                {renderVariations()}
              </FormLayout.InputContainer>
            </FormLayout.LabelInputContainer>
          </div>
        </Card>
        {/* Product Management */}
        <Card className='shadow bg-base-100'>
          <div className='flex flex-col gap-2 p-4 md:p-10'>
            <SectionHeading
              title='Product Management'
              description='Manage the product.'
            />
            {/* toods: product status toggle */}
            {/* todos: stock */}
            {/* todos: product sku */}
          </div>
        </Card>
        {/* Shipment */}
        <Card className='shadow bg-base-100'>
          <div className='flex flex-col gap-2 p-4 md:p-10'>
            <SectionHeading
              title='Shipment'
              description='Product shipment information.'
            />
            {/* input: weight */}
            <FormLayout.LabelInputErrorContainer>
              <FormLayout.LabelInputContainer>
                <FormLayout.LabelContainer justify='justify-start'>
                  <Label required={true}>Weight</Label>
                </FormLayout.LabelContainer>
                <FormLayout.InputContainer>
                  <div className='flex items-center gap-2'>
                    <InputGroup>
                      <Input
                        type='number'
                        name='weight'
                        className='w-full'
                        value={productFormik.values.weight}
                        onChange={productFormik.handleChange}
                        onFocus={() => (productFormik.touched.weight = true)}
                        onKeyDown={handleNumberInvalidKey}
                      />
                      <span>gr</span>
                    </InputGroup>
                  </div>
                </FormLayout.InputContainer>
              </FormLayout.LabelInputContainer>
              <FormLayout.InputError>
                {productFormik.touched.weight &&
                  productFormik.errors.weight && (
                    <label className='label-text-alt text-error'>
                      {productFormik.errors.weight}
                    </label>
                  )}
              </FormLayout.InputError>
            </FormLayout.LabelInputErrorContainer>
            {/* todos: package size (PxLxT) string */}
            <FormLayout.LabelInputErrorContainer>
              <FormLayout.LabelInputContainer>
                <FormLayout.LabelContainer justify='justify-start'>
                  <Label>Package Size</Label>
                </FormLayout.LabelContainer>
                <FormLayout.InputContainer>
                  <div className='grid grid-cols-1 lg:grid-cols-3 gap-2'>
                    {/* Length */}
                    <div className='flex flex-col'>
                      <InputGroup>
                        <Input
                          type='number'
                          name='package_size_length'
                          className='w-full'
                          placeholder='Length'
                          value={productFormik.values.package_size_length}
                          onChange={productFormik.handleChange}
                          onFocus={() =>
                            (productFormik.touched.package_size_length = true)
                          }
                          onKeyDown={handleNumberInvalidKey}
                        />
                        <span>cm</span>
                      </InputGroup>
                      <div>
                        {productFormik.touched.package_size_length &&
                          productFormik.errors.package_size_length && (
                            <label className='label-text-alt text-error'>
                              {productFormik.errors.package_size_length}
                            </label>
                          )}
                      </div>
                    </div>
                    {/* Width */}
                    <div className='flex flex-col'>
                      <InputGroup>
                        <Input
                          type='number'
                          name='package_size_width'
                          className='w-full'
                          placeholder='Width'
                          value={productFormik.values.package_size_width}
                          onChange={productFormik.handleChange}
                          onFocus={() =>
                            (productFormik.touched.package_size_width = true)
                          }
                          onKeyDown={handleNumberInvalidKey}
                        />
                        <span>cm</span>
                      </InputGroup>
                      <div>
                        {productFormik.touched.package_size_width &&
                          productFormik.errors.package_size_width && (
                            <label className='label-text-alt text-error'>
                              {productFormik.errors.package_size_width}
                            </label>
                          )}
                      </div>
                    </div>
                    {/* Height */}
                    <div className='flex flex-col'>
                      <InputGroup>
                        <Input
                          type='number'
                          name='package_size_height'
                          className='w-full'
                          placeholder='Height'
                          value={productFormik.values.package_size_height}
                          onChange={productFormik.handleChange}
                          onFocus={() =>
                            (productFormik.touched.package_size_height = true)
                          }
                          onKeyDown={handleNumberInvalidKey}
                        />
                        <span>cm</span>
                      </InputGroup>
                      <div>
                        {productFormik.touched.package_size_height &&
                          productFormik.errors.package_size_height && (
                            <label className='label-text-alt text-error'>
                              {productFormik.errors.package_size_height}
                            </label>
                          )}
                      </div>
                    </div>
                  </div>
                </FormLayout.InputContainer>
              </FormLayout.LabelInputContainer>
            </FormLayout.LabelInputErrorContainer>
            {/* todos: is hazardous toggle */}
            {/* todos: courier service
                radio: standard or custom
                  standard: follow merchant configuration
                  custom: user custom from merchant configuration
          */}
            {/* input preorder toggle */}
            <FormLayout.LabelInputErrorContainer>
              <FormLayout.LabelInputContainer>
                <FormLayout.LabelContainer className='justify-center'>
                  <Label>Pre-Order</Label>
                </FormLayout.LabelContainer>
                <FormLayout.InputContainer>
                  <div className='flex items-center gap-2'>
                    <Toggle
                      checked={productFormik.values.process_day !== 2}
                      onChange={handlePreorderToggleOnChange}
                    />
                    <span>
                      Activate Pre-Order if you need a longer delivery time.
                    </span>
                  </div>
                </FormLayout.InputContainer>
              </FormLayout.LabelInputContainer>
              {productFormik.values.process_day !== 2 && (
                <>
                  <FormLayout.LabelInputContainer>
                    <FormLayout.LabelContainer />
                    <FormLayout.InputContainer>
                      <>
                        <div className='flex items-center gap-2'>
                          <Input
                            type='text'
                            name='preorder_day'
                            className='w-full'
                            value={productFormik.values.preorder_day}
                            onChange={productFormik.handleChange}
                            onFocus={() =>
                              (productFormik.touched.preorder_day = true)
                            }
                          />
                          <span>days</span>
                        </div>
                      </>
                    </FormLayout.InputContainer>
                  </FormLayout.LabelInputContainer>
                  <FormLayout.InputError>
                    {productFormik.touched.preorder_day &&
                      productFormik.errors.preorder_day && (
                        <label className='label-text-alt text-error'>
                          {productFormik.errors.preorder_day}
                        </label>
                      )}
                  </FormLayout.InputError>
                </>
              )}
            </FormLayout.LabelInputErrorContainer>
          </div>
        </Card>
        <Button
          color='primary'
          type='submit'
          form='addProductForm'
          loading={createProductIsLoading}
        >
          Save
        </Button>
      </Form>
      <CategoryModal
        open={openCategoryModal}
        setOpen={setOpenCategoryModal}
        handleCategoryOnClick={handleCategoryOnClick}
      />
    </>
  );
};

export default ProductAddContent;
