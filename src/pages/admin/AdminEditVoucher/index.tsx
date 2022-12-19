import { AdminVoucherForm } from '../../../components';
import { SellerAccountVoucherFormContent } from '../../../types/content';

const AdminEditVoucher = () => {
  return <AdminVoucherForm content={SellerAccountVoucherFormContent.Edit} />;
};

export default AdminEditVoucher;
