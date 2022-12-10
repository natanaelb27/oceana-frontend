import Cookies from 'js-cookie';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';

import { Layout } from '../components';
import {
  AdminAddPromotion,
  AdminEditPromotion,
  AdminHome,
  AdminPromotionList,
  AdminRefund,
  BuyerAddress,
  BuyerCart,
  BuyerCheckout,
  BuyerPassword,
  BuyerProfile,
  BuyerPurchaseHistory,
  BuyerRefund,
  BuyerWallet,
  Category,
  Home,
  Login,
  NotFound,
  Product,
  Register,
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
  ShopPromotionList,
  ShopShipmentSetting,
  ShopVoucherList,
  SealabsPay,
  SealabsPayRedirect,
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
          element: <SealabsPay />,
        },
        {
          path: '/category',
          element: <Category />,
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
          path: '/products/:productID',
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
                  path: '/seller/marketing/vouchers/add',
                  element: <ShopAddVoucher />,
                },
                {
                  path: '/seller/marketing/vouchers/edit',
                  element: <ShopEditVoucher />,
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
                  path: '/seller/marketing/promotions/add',
                  element: <ShopAddPromotion />,
                },
                {
                  path: '/seller/marketing/promotions/edit',
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
          path: '/admin/promotions',
          element: <Navigate to='/admin/promotions/list' />,
        },
        {
          path: '/admin/promotions/list',
          element: <AdminPromotionList />,
        },
        {
          path: '/admin/promotions/add',
          element: <AdminAddPromotion />,
        },
        {
          path: '/admin/promotions/edit',
          element: <AdminEditPromotion />,
        },
        {
          path: '/admin/refunds',
          element: <AdminRefund />,
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
      path: '/sealabs-pay/success',
      element: (
        <ProtectedRoute
          roleCode={roleCode}
          isTokenExist={isTokenExist}
          allowedRoles={[Role.Buyer, Role.Seller]}
          redirectTo='/'
        >
          <SealabsPayRedirect />
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
