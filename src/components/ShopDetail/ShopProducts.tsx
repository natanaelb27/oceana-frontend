import { useEffect, useState } from 'react';
import { useGetAllMerchantProductsQuery } from '../../store/services/merchantService';
import { Product } from '../../types/component';
import { useSearchParams } from 'react-router-dom';
import { MerchantProductQuery } from '../../types/query';
import { toMerchantProductQuery } from '../../utils/mapperDTO';
import { ProductCard } from '../common';
import { ProductsSortBy, ProductsSortByString, ProductsSortString } from '../../types/sort';

type ShopProductsCardProps = {
  merchantID: string | null | undefined;
}

const ShopProducts = ({ merchantID }: ShopProductsCardProps) => {
  const [sort, setSort] = useState('desc');
  const [sortBy, setSortBy] = useState('most-buy');

  const [merchantProductQuery, setMerchantProductQuery] = useState<MerchantProductQuery>({
    search: '',
    sort: sort,
    sortBy: sortBy,
    limit: 20,
    page: 1,
    categoryID: 0,
    priceMinimum: 0,
    priceMaximum: 0,
    merchantCities: [],
    courierServices: [],
  });

  const [searchParams] = useSearchParams();

  const { data: getAllMerchantProducts } = useGetAllMerchantProductsQuery({ id: String(merchantID), query: toMerchantProductQuery(merchantProductQuery)});

  const sortByParam = searchParams.get('sort-by') || '';
  const sortParam = searchParams.get('sort') || '';

  useEffect(() => {
    setMerchantProductQuery({
      ...merchantProductQuery,
      sortBy,
      sort
    });
  }, [sortByParam, sortParam]);

  const handleSortChange = (value: string) => {
      let sortBy = '';
      let sort = '';

      if (value === ProductsSortByString.BestSeller){
        sortBy = ProductsSortByString.BestSeller;
        sort = ProductsSortByString.Default;
      } else if (value === ProductsSortByString.Newest) {
        sortBy = ProductsSortByString.Newest;
        sort = ProductsSortByString.Default;
      }  else if (value === 'most-expensive') {
        sortBy = ProductsSortByString.Price;
        sort = ProductsSortString.HighestPrice;
      } else if (value === 'cheapest') {
        sortBy = ProductsSortByString.Price;
        sort = ProductsSortString.LowestPrice;
      }

      setSort(sort);
      setMerchantProductQuery({
        ...merchantProductQuery,
        sortBy,
        sort
      });
  };

  return (
    <div className='flex w-3/5 flex-col'>
      <div className='flex flex-row justify-between'>
        <h1 className='text-2xl font-bold mb-3'>Products</h1>
        <h1 className='text-lg font-bold'>Sort By:</h1>
        <select className='select select-bordered' onChange={(e) => handleSortChange(e.target.value)}>
          <option value='most-buy'>Most Purchased</option>
          <option value='newest'>Most Recent</option>
          <option value='most-expensive'>Most Expensive</option>
          <option value='cheapest'>Cheapest</option>
        </select>
      </div>
      <div className='flex flex-row flex-wrap justify-start'>
        {getAllMerchantProducts?.data?.map((product, i) => {
            return <div className='mr-3 mb-3 w-64' key={i}>
              <ProductCard product={product} key={product.id}/>
            </div>;
        })}
      </div>
    </div>

  );
};

export default ShopProducts;