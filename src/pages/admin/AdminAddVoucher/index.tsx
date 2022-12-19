import { AdminVoucherForm } from '../../../components';
import { SellerAccountVoucherFormContent } from '../../../types/content';

const AdminAddVoucher = () => {
  return <AdminVoucherForm content={SellerAccountVoucherFormContent.Add} />;
};

export default AdminAddVoucher;
