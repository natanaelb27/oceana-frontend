import { Card, Divider } from 'react-daisyui';
import { useGetProductDetailQuery } from '../../store/services/productService';
import ProductCart from './ProductCart';
import ProductDescription from './ProductDescription';
import ProductMedia from './ProductMedia';
import Reviews from './Reviews';
import ReviewStatsAndFilter from './ReviewStatsAndFilter';
import ShopBanner from './ShopBanner';

type ProductDetailProps = {
  productID: string | undefined;
};

const ProductDetail = ({ productID }: ProductDetailProps) => {
  const { data: getProductDetailData, isLoading: getProductDetailIsLoading } =
    useGetProductDetailQuery(productID);
  console.log(getProductDetailData);

  if (!getProductDetailData?.data) {
    return <div>404</div>;
  }

  if (getProductDetailIsLoading) {
    return (
      <div className='p-4 md:p-10 animate-pulse'>
        <div className='grid grid-cols-12 gap-4 md:gap-10'>
          <div className='col-span-12 md:col-span-3'>
            <Card className='shadow max-w-sm'>
              <div className='h-64 w-full bg-base-200 rounded'></div>
              <div className='p-4'>
                <div className='h-12 w-full bg-base-200 rounded-full'></div>
              </div>
            </Card>
          </div>
          <div className='col-span-12 md:col-span-6'>
            <div className='grid grid-col-12 gap-4 mb-10'>
              <div className='h-4 bg-base-200 rounded-full col-span-12 w-2/5 mb-1'></div>
              <div className='h-4 bg-base-200 rounded-full col-span-3'></div>
              <div className='h-4 bg-base-200 rounded-full col-span-9'></div>
              <div className='h-4 bg-base-200 rounded-full col-span-3'></div>
              <div className='h-4 bg-base-200 rounded-full col-span-9'></div>
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
              <div className='h-4 bg-base-200 rounded-full col-span-3'></div>
              <div className='h-4 bg-base-200 rounded-full col-span-9'></div>
            </div>
            <Divider />
            <ShopBanner isLoading />
          </div>
          <div className='col-span-12 md:col-span-3'>
            <Card className='shadow max-w-sm'>
              <div className='p-4'>
                <div className='h-36 w-full bg-base-200 rounded-md'></div>
                <Divider />
                <div className='h-12 w-full bg-base-200 rounded-md mb-4'></div>
                <div className='h-12 w-full bg-base-200 rounded-md'></div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto'>
      <div className='px-4 py-10'>
        <div className='grid grid-cols-12 gap-4 gap-y-10 md:gap-10'>
          <div className='col-span-12 md:col-span-3'>
            <ProductMedia />
          </div>
          <div className='col-span-12 md:col-span-6'>
            <ProductDescription productDetail={getProductDetailData.data} />
          </div>
          <div className='col-span-12 md:col-span-3'>
            <ProductCart />
          </div>
          <div className='col-span-12 md:col-span-3'>
            <ReviewStatsAndFilter />
          </div>
          <div className='col-span-12 md:col-span-6'>
            <Reviews />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
