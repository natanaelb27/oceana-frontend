import Cookies from 'js-cookie';
import React from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';

import { Layout } from '../components';
import { Loading } from '../components/common';
import {
  BuyerRefundCreate,
  Login,
  NotFound,
  Register,
  ResetPassword,
  SealabsPayPaymentRedirect,
  SealabsPayRegisterRedirect,
  SealabsPayTopup,
  SealabsPayTopupRedirect,
} from '../pages';

const Home = React.lazy(() => import('../pages/Home'));
const Product = React.lazy(() => import('../pages/Product'));
const Search = React.lazy(() => import('../pages/Search'));
const Shop = React.lazy(() => import('../pages/Shop'));
const Category = React.lazy(() => import('../pages/Category'));
const CategorySearch = React.lazy(
  () => import('../pages/Category/CategorySearch')
);

const BuyerAddress = React.lazy(() => import('../pages/buyer/BuyerAddress'));
const BuyerCart = React.lazy(() => import('../pages/buyer/BuyerCart'));
const BuyerCheckout = React.lazy(() => import('../pages/buyer/BuyerCheckout'));
const BuyerPassword = React.lazy(() => import('../pages/buyer/BuyerPassword'));
const BuyerProfile = React.lazy(() => import('../pages/buyer/BuyerProfile'));
const BuyerPurchaseHistory = React.lazy(
  () => import('../pages/buyer/BuyerPurchaseHistory')
);
const BuyerRefund = React.lazy(() => import('../pages/buyer/BuyerRefund'));
const BuyerSealabsPay = React.lazy(
  () => import('../pages/buyer/BuyerSealabsPay')
);
const BuyerWallet = React.lazy(() => import('../pages/buyer/BuyerWallet'));
const SellerRegistration = React.lazy(
  () => import('../pages/buyer/SellerRegistration')
);

const ShopAddProduct = React.lazy(
  () => import('../pages/seller/ShopAddProduct')
);
const ShopAddPromotion = React.lazy(
  () => import('../pages/seller/ShopAddPromotion')
);
const ShopAddress = React.lazy(() => import('../pages/seller/ShopAddress'));
const ShopAddVoucher = React.lazy(
  () => import('../pages/seller/ShopAddVoucher')
);
const ShopEditProduct = React.lazy(
  () => import('../pages/seller/ShopEditProduct')
);
const ShopEditPromotion = React.lazy(
  () => import('../pages/seller/ShopEditPromotion')
);
const ShopEditVoucher = React.lazy(
  () => import('../pages/seller/ShopEditVoucher')
);
const ShopOrder = React.lazy(() => import('../pages/seller/ShopOrder'));
const ShopProductList = React.lazy(
  () => import('../pages/seller/ShopProductList')
);
const ShopProfile = React.lazy(() => import('../pages/seller/ShopProfile'));
const ShopPromotionDetail = React.lazy(
  () => import('../pages/seller/ShopPromotionDetail')
);
const ShopPromotionList = React.lazy(
  () => import('../pages/seller/ShopPromotionList')
);
const ShopShipmentSetting = React.lazy(
  () => import('../pages/seller/ShopShipmentSetting')
);
const ShopVoucherDetail = React.lazy(
  () => import('../pages/seller/ShopVoucherDetail')
);
const ShopVoucherList = React.lazy(
  () => import('../pages/seller/ShopVoucherList')
);

const AdminAddVoucher = React.lazy(
  () => import('../pages/admin/AdminAddVoucher')
);
const AdminDetailVoucher = React.lazy(
  () => import('../pages/admin/AdminDetailVoucher')
);
const AdminEditVoucher = React.lazy(
  () => import('../pages/admin/AdminEditVoucher')
);
const AdminHome = React.lazy(() => import('../pages/admin/AdminHome'));

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
          <React.Suspense fallback={<Loading isLoading />}>
            <Layout />
          </React.Suspense>
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
              path: '/user/refund/create/:orderID',
              element: <BuyerRefundCreate />,
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
