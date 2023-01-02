import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProductSnapshotDetail from '../../components/ProductSnapshotDetail';
import { useLazyGetProductSnapshotQuery } from '../../store/services/profileService';

const ProductSnapshot = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [getProductSnapshot, { data: getProductSnapshotData }] =
    useLazyGetProductSnapshotQuery();

  useEffect(() => {
    getProductSnapshot(params.orderDetailID || '')
      .unwrap()
      .catch(() => {
        navigate('/user/purchase');
      });
  }, [params.orderDetailID]);

  return (
    <ProductSnapshotDetail
      productSnapshotData={getProductSnapshotData}
    ></ProductSnapshotDetail>
  );
};

export default ProductSnapshot;
