import { useParams } from 'react-router-dom';
import { ProductDetail } from '../../components';

const Product = () => {
  const { productPath } = useParams();
  // console.log(productPath?.split('-i.'));
  const merchantID = productPath?.split('-i.').slice(-1)[0].split('-')[0];
  const productID = productPath?.split('-i.').slice(-1)[0].split('-')[1];
  return <ProductDetail merchantID={merchantID} productID={productID} />;
};

export default Product;
