import { useParams } from 'react-router-dom';
import { ProductDetail } from '../../components';

const Product = () => {
  const { productID } = useParams();
  return <ProductDetail productID={productID}/>;
};

export default Product;
