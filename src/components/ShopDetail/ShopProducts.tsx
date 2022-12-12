import { Product } from '../../types/component';
import { ProductCard } from '../common';

type ShopProductsCardProps = {
    products: Product[] | null | undefined;
}

const ShopProducts = ({ products }: ShopProductsCardProps) => {
  return (
    <div className='flex w-3/5 flex-col'>
      <h1 className='text-2xl font-bold mb-3'>Products</h1>
      <div className='flex flex-row flex-wrap justify-start'>
        {products?.map((product, i) => {
            return <div className='mr-3 mb-3 w-64' key={i}>
              <ProductCard product={product} key={product.id}/>
            </div>;
        })}
      </div>
    </div>

  );
};

export default ShopProducts;