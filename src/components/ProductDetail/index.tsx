import ProductCart from './ProductCart';
import ProductDescription from './ProductDescription';
import ProductMedia from './ProductMedia';
import ReviewStatsAndFilter from './ReviewStatsAndFilter';

const ProductDetail = () => {
  return (
    <div className='container mx-auto'>
      <div className='px-4 py-10'>
        <div className='grid grid-cols-12 gap-4 gap-y-10 md:gap-10'>
          <div className='col-span-12 md:col-span-3'>
            <ProductMedia />
          </div>
          <div className='col-span-12 md:col-span-6'>
            <ProductDescription />
          </div>
          <div className='col-span-12 md:col-span-3'>
            <ProductCart />
          </div>
          <div className='col-span-12 md:col-span-3'>
            <ReviewStatsAndFilter />
          </div>
          <div className='col-span-12 md:col-span-6'></div>
          <div className='col-span-12 md:col-span-3'>
            <ReviewStatsAndFilter isLoading />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
