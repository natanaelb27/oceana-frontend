import Cookies from 'js-cookie';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';

import { Layout } from '../components';
import {
  AdminAddVoucher,
  AdminDetailVoucher,
  AdminEditVoucher,
  AdminHome,
  BuyerAddress,
  BuyerCart,
  BuyerCheckout,
  BuyerPassword,
  BuyerProfile,
  BuyerPurchaseHistory,
  BuyerRefund,
  BuyerSealabsPay,
  BuyerWallet,
  Category,
  CategorySearch,
  Home,
  Login,
  NotFound,
  Product,
  Register,
  ResetPassword,
  SealabsPayPaymentRedirect,
  SealabsPayRegisterRedirect,
  SealabsPayTopup,
  SealabsPayTopupRedirect,
  Search,
  SellerRegistration,
  Shop,
  ShopAddProduct,
  ShopAddPromotion,
  ShopAddress,
  ShopAddVoucher,
  ShopEditProduct,
  ShopEditPromotion,
  ShopEditVoucher,
  ShopOrder,
  ShopProductList,
  ShopProfile,
  ShopPromotionDetail,
  ShopPromotionList,
  ShopShipmentSetting,
  ShopVoucherDetail,
  ShopVoucherList,
} from '../pages';
import { selectRole } from '../store/slices/authSlice';
import { useAppSelector } from '../store/store';
import { Role } from '../types/role';
import ProtectedRoute from './ProtectedRoute';

const Routes = () => {
  const roleCode = useAppSelector(selectRole);
  const isTokenExist = Cookies.get('access_token_verifier') === '';

  return useRoutes([
    {
      path: '/',
      element: (
        <ProtectedRoute
          roleCode={roleCode}
          isTokenExist={isTokenExist}
          allowedRoles={[Role.Guest, Role.Buyer, Role.Seller]}
          redirectTo='/admin'
        >
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: '/',
          element: <Home />,
        },
        {
          path: '/sealabs-pay',
          element: <SealabsPayTopup />,
        },
        {
          path: '/category',
          element: <Category />,
        },
        {
          path: '/category/:categoryPath',
          element: <CategorySearch />,
        },
        {
          path: '/search',
          element: <Search />,
        },
        {
          path: '/products',
          element: <Navigate to='/' />,
        },
        {
          path: '/products/:productPath',
          element: <Product />,
        },
        {
          path: '/shops',
          element: <Navigate to='/' />,
        },
        {
          path: '/shops/:shopID',
          element: <Shop />,
        },
        {
          path: '/',
          element: (
            <ProtectedRoute
              roleCode={roleCode}
              isTokenExist={isTokenExist}
              allowedRoles={[Role.Buyer, Role.Seller]}
              redirectTo='/login'
            >
              <Outlet />
            </ProtectedRoute>
          ),
          children: [
            {
              path: '/user',
              element: <Navigate to='/user/account/profile' />,
            },
            {
              path: '/user/account',
              element: <Navigate to='/user/account/profile' />,
            },
            {
              path: '/user/account/profile',
              element: <BuyerProfile />,
            },
            {
              path: '/user/account/wallet',
              element: <BuyerWallet />,
            },
            {
              path: '/user/account/sealabs-pay',
              element: <BuyerSealabsPay />,
            },
            {
              path: '/user/account/address',
              element: <BuyerAddress />,
            },
            {
              path: '/user/account/password',
              element: <BuyerPassword />,
            },
            {
              path: '/user/purchase',
              element: <BuyerPurchaseHistory />,
            },
            {
              path: '/user/refund',
              element: <BuyerRefund />,
            },
            {
              path: '/cart',
              element: <BuyerCart />,
            },
            {
              path: '/checkout',
              element: <BuyerCheckout />,
            },
            {
              path: '/',
              element: (
                <ProtectedRoute
                  roleCode={roleCode}
                  isTokenExist={isTokenExist}
                  allowedRoles={[Role.Buyer]}
                  redirectTo='/'
                >
                  <Outlet />
                </ProtectedRoute>
              ),
              children: [
                {
                  path: '/seller/registration',
                  element: <SellerRegistration />,
                },
              ],
            },
            {
              path: '/',
              element: (
                <ProtectedRoute
                  roleCode={roleCode}
                  isTokenExist={isTokenExist}
                  allowedRoles={[Role.Seller]}
                  redirectTo='/seller/registration'
                >
                  <Outlet />
                </ProtectedRoute>
              ),
              children: [
                {
                  path: '/seller',
                  element: <Navigate to='/seller/shop/profile' />,
                },
                {
                  path: '/seller/shop',
                  element: <Navigate to='/seller/shop/profile' />,
                },
                {
                  path: '/seller/shop/profile',
                  element: <ShopProfile />,
                },
                {
                  path: '/seller/shop/address',
                  element: <ShopAddress />,
                },
                {
                  path: '/seller/marketing',
                  element: <Navigate to='/seller/marketing/products/list' />,
                },
                {
                  path: '/seller/marketing/products',
                  element: <Navigate to='/seller/marketing/products/list' />,
                },
                {
                  path: '/seller/marketing/products/list',
                  element: <ShopProductList />,
                },
                {
                  path: '/seller/marketing/products/add',
                  element: <ShopAddProduct />,
                },
                {
                  path: '/seller/marketing/products/edit',
                  element: <ShopEditProduct />,
                },
                {
                  path: '/seller/marketing/vouchers',
                  element: <Navigate to='/seller/marketing/vouchers/list' />,
                },
                {
                  path: '/seller/marketing/vouchers/list',
                  element: <ShopVoucherList />,
                },
                {
                  path: '/seller/marketing/vouchers/detail',
                  element: <Navigate to='/seller/marketing/vouchers/list' />,
                },
                {
                  path: '/seller/marketing/vouchers/detail/:voucherID',
                  element: <ShopVoucherDetail />,
                },
                {
                  path: '/seller/marketing/vouchers/add',
                  element: <ShopAddVoucher />,
                },
                {
                  path: '/seller/marketing/vouchers/edit/:voucherID',
                  element: <ShopEditVoucher />,
                },
                {
                  path: '/seller/marketing/vouchers/duplicate/:voucherID',
                  element: <ShopAddVoucher />,
                },
                {
                  path: '/seller/marketing/promotions',
                  element: <Navigate to='/seller/marketing/promotions/list' />,
                },
                {
                  path: '/seller/marketing/promotions/list',
                  element: <ShopPromotionList />,
                },
                {
                  path: '/seller/marketing/promotions/detail',
                  element: <Navigate to='/seller/marketing/promotions/list' />,
                },
                {
                  path: '/seller/marketing/promotions/detail/:promotionID',
                  element: <ShopPromotionDetail />,
                },
                {
                  path: '/seller/marketing/promotions/add',
                  element: <ShopAddPromotion />,
                },
                {
                  path: '/seller/marketing/promotions/edit/:promotionID',
                  element: <ShopEditPromotion />,
                },
                {
                  path: '/seller/orders/',
                  element: <ShopOrder />,
                },
                {
                  path: '/seller/settings/shipment/',
                  element: <ShopShipmentSetting />,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      path: '/admin',
      element: (
        <ProtectedRoute
          roleCode={roleCode}
          isTokenExist={isTokenExist}
          allowedRoles={[Role.Admin]}
          redirectTo='/'
        >
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: '/admin',
          element: <AdminHome />,
        },
        {
          path: '/admin/vouchers',
          element: <Navigate to='/admin/vouchers/list' />,
        },
        {
          path: '/admin/vouchers/list',
          element: <Navigate to='/admin' />,
        },
        {
          path: '/admin/vouchers/add',
          element: <AdminAddVoucher />,
        },
        {
          path: '/admin/vouchers/detail',
          element: <Navigate to='/admin/vouchers/list' />,
        },
        {
          path: '/admin/vouchers/detail/:voucherID',
          element: <AdminDetailVoucher />,
        },
        {
          path: '/admin/vouchers/duplicate/:voucherID',
          element: <AdminAddVoucher />,
        },
        {
          path: '/admin/vouchers/edit/:voucherID',
          element: <AdminEditVoucher />,
        },
        {
          path: '/admin/refunds',
          element: <Navigate to='/admin' />,
        },
      ],
    },
    {
      path: '/login',
      element: (
        <ProtectedRoute
          roleCode={roleCode}
          isTokenExist={isTokenExist}
          allowedRoles={[Role.Guest]}
          redirectTo='/'
        >
          <Login />
        </ProtectedRoute>
      ),
    },
    {
      path: '/register',
      element: (
        <ProtectedRoute
          roleCode={roleCode}
          isTokenExist={isTokenExist}
          allowedRoles={[Role.Guest]}
          redirectTo='/'
        >
          <Register />
        </ProtectedRoute>
      ),
    },
    {
      path: '/reset-password/:resetPasswordID',
      element: (
        <ProtectedRoute
          roleCode={roleCode}
          isTokenExist={isTokenExist}
          allowedRoles={[Role.Guest]}
          redirectTo='/'
        >
          <ResetPassword />
        </ProtectedRoute>
      ),
    },
    {
      path: '/sealabs-pay/redirect/register',
      element: (
        <ProtectedRoute
          roleCode={roleCode}
          isTokenExist={isTokenExist}
          allowedRoles={[Role.Buyer, Role.Seller]}
          redirectTo='/'
        >
          <SealabsPayRegisterRedirect />
        </ProtectedRoute>
      ),
    },
    {
      path: '/sealabs-pay/redirect/topup',
      element: (
        <ProtectedRoute
          roleCode={roleCode}
          isTokenExist={isTokenExist}
          allowedRoles={[Role.Buyer, Role.Seller]}
          redirectTo='/'
        >
          <SealabsPayTopupRedirect />
        </ProtectedRoute>
      ),
    },
    {
      path: '/sealabs-pay/redirect/payment',
      element: (
        <ProtectedRoute
          roleCode={roleCode}
          isTokenExist={isTokenExist}
          allowedRoles={[Role.Buyer, Role.Seller]}
          redirectTo='/'
        >
          <SealabsPayPaymentRedirect />
        </ProtectedRoute>
      ),
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ]);
};

export default Routes;
