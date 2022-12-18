import { FieldArray, getIn, useFormik } from 'formik';
import { Button, Card, Form, Input, Toggle } from 'react-daisyui';
import * as Yup from 'yup';
import { formikPreorderDay } from '../../../utils/yupValidation';
import SectionHeading from '../../common/SectionHeading/index';
import * as FormLayout from './FormLayout';
import * as ProductVariantLayout from './ProductVariantLayout';
import { PUMVariant } from '../../../types/component/product';
import { Action } from './Action';
import { BiTime, BiTrash } from 'react-icons/bi';
import { FaCross, FaTimes } from 'react-icons/fa';
import { CgCross, CgTrashEmpty } from 'react-icons/cg';

const ProductAddContent = () => {
  const productFormik = useFormik({
    initialValues: {
      id: 0,
      name: '',
      description: '',
      category_id: 0,
      merchant_id: 0,
      weight: 0,
      is_hazardous: false,
      package_size: '',
      condition: '',
      status: '',
      process_day: 0,
      preorder_day: 0,
      images: '',
      videos: '',
      product_items: [],
      variants: [
        {
          name: 'Color',
          options: ['Red', 'Blue'],
          images: ['red.jpg', 'blue.jpg'],
        },
        {
          name: 'Size',
          options: ['S', 'M'],
          images: [],
        },
      ],
      couriers: [],
    },
    validationSchema: Yup.object({
      id: Yup.number().required('Please enter id'),
      name: Yup.string().required('Please enter name'),
      description: Yup.string().required('Please enter description'),
      category_id: Yup.number().required('Please enter category_id'),
      merchant_id: Yup.number().required('Please enter merchant_id'),
      weight: Yup.number().required('Please enter weight'),
      is_hazardous: Yup.boolean().required('Please enter is hazardous'),
      package_size: Yup.string().required('Please enter package_size'),
      condition: Yup.string().required('Please enter condition'),
      status: Yup.string().required('Please enter status'),
      process_day: Yup.number().required('Please enter process_day'),
      preorder_day: Yup.number().test('preorder_day', (value, ctx) =>
        formikPreorderDay(ctx, value)
      ),
      images: Yup.string().required('Please enter images'),
      videos: Yup.string().required('Please enter videos'),
      product_items: Yup.array().of(
        Yup.object().shape({
          id: Yup.number().required('Please enter id'),
          sku: Yup.string().required('Please enter sku'),
          variant_index: Yup.array().required('Please enter variant index'),
          price: Yup.number().required('Please enter price'),
          stock_quantity: Yup.number().required('Please enter stock quantity'),
        })
      ),
      variants: Yup.array().of(
        Yup.object().shape({
          name: Yup.string().required('Please enter variants name'),
          options: Yup.array().of(
            Yup.string().required('Please enter option name')
          ),
          images: Yup.string(),
        })
      ),
      // couriers: [],
    }),

    onSubmit: () => {
      return;
    },
  });

  const handlePreorderToggleOnChange = () => {
    if (productFormik.values.preorder_day === 0) {
      productFormik.setFieldValue('preorder_day', 7);
    } else {
      productFormik.setFieldValue('preorder_day', 0);
    }
  };

  const deepCopyVariants = (data: PUMVariant[]) => {
    return data ? (JSON.parse(JSON.stringify(data)) as typeof data) : null;
  };

  const handleDeleteVariantOnClick = (index: number) => {
    const newData = deepCopyVariants(productFormik.values.variants);

    if (index < 0 || newData === null) {
      return;
    }

    newData.splice(index, 1);

    productFormik.setFieldValue('variants', newData);
  };

  const handleDeleteVariantOptionOnClick = (
    indexVariant: number,
    indexOption: number
  ) => {
    const newData = deepCopyVariants(productFormik.values.variants);

    if (indexVariant < 0 || indexOption < 0 || newData === null) {
      return;
    }

    // validate if options length is 1 then dont allow delete (show error)

    newData[indexVariant].options.splice(indexOption, 1);

    productFormik.setFieldValue('variants', newData);
  };

  const renderVariants = () => {
    // if(productFormik.values.variants.length>0){
    // }
    return (
      <div className='flex flex-col gap-2'>
        {
          // variants
          productFormik.values.variants.map((_, indexVariant) => (
            <div
              className='flex flex-col gap-2 bg-gray-100 p-5'
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
            </div>
          ))
        }
      </div>
    );
  };

  return (
    <Form
      id='addProductForm'
      className='flex flex-col gap-4 p-0 md:p-4 rounded-lg bg-gray-100'
      onSubmit={(e) => {
        e.preventDefault();
        productFormik.handleSubmit();
      }}
    >
      {/* Product Information */}
      <Card className='shadow bg-white'>
        <div className='p-4 md:p-10'>
          <SectionHeading
            title='Product Information'
            description='Basic information about the product.'
          />
          {/* toods: name */}
          {/* toods: category */}
          {/* todos: photo upload */}
        </div>
      </Card>
      {/* Product Detail */}
      <Card className='shadow bg-white'>
        <div className='p-4 md:p-10'>
          <SectionHeading
            title='Product Detail'
            description='Detailed information about the product.'
          />
          {/* toods: description */}
          {/* todos: condition */}
          {/* todos: is hazardous */}
        </div>
      </Card>
      {/* show if variants length > 0 */}
      <Card className='shadow bg-white'>
        <div className='p-4 md:p-10'>
          <SectionHeading
            title='Product Variant'
            description='Manage the product.'
          />
          {/* ongoing: product variant */}
          <FormLayout.LabelInputContainer>
            <FormLayout.LabelContainer>
              <Form.Label title='Variants' />
            </FormLayout.LabelContainer>
            <FormLayout.InputContainer>
              {renderVariants()}
            </FormLayout.InputContainer>
          </FormLayout.LabelInputContainer>
        </div>
      </Card>
      {/* Product Management */}
      <Card className='shadow bg-white'>
        <div className='p-4 md:p-10'>
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
      <Card className='shadow bg-white'>
        <div className='p-4 md:p-10'>
          <SectionHeading
            title='Shipment'
            description='Product shipment information.'
          />
          {/* toods: weight number */}
          {/* todos: package size (PxLxT) string */}
          {/* todos: is hazardous toggle */}
          {/* todos: courier service
                radio: standard or custom
                  standard: follow merchant configuration
                  custom: user custom from merchant configuration
          */}
          {/* input preorder toggle */}
          <FormLayout.LabelInputContainer>
            <FormLayout.LabelContainer>
              <Form.Label title='Pre-Order' />
            </FormLayout.LabelContainer>
            <FormLayout.InputContainer>
              <div className='flex gap-2'>
                <Toggle onChange={handlePreorderToggleOnChange} />
                <span>
                  Activate Pre-Order if you need a longer delivery time.
                </span>
              </div>
            </FormLayout.InputContainer>
          </FormLayout.LabelInputContainer>
          <FormLayout.LabelInputContainer>
            <FormLayout.LabelContainer />
            <FormLayout.InputContainer>
              {productFormik.values.preorder_day > 0 && (
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
                  {productFormik.touched.preorder_day &&
                    productFormik.errors.preorder_day && (
                      <label className='label-text-alt text-error'>
                        {productFormik.errors.preorder_day}
                      </label>
                    )}
                </>
              )}
            </FormLayout.InputContainer>
          </FormLayout.LabelInputContainer>
        </div>
      </Card>
      <Button
        color='primary'
        type='submit'
        form='addProductForm'
        loading={false}
      >
        Save
      </Button>
    </Form>
  );
};

export default ProductAddContent;
