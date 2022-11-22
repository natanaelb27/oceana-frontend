import { Navigate } from 'react-router-dom';

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
  ShopVoucherList,
} from '../pages';
import { Layout } from '../components';

export const GUEST_ROUTES = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/Category',
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
        path: '/user',
        element: <Navigate to='/' />,
      },
      {
        path: '/user/account',
        element: <Navigate to='/' />,
      },
      {
        path: '/user/account/profile',
        element: <Navigate to='/' />,
      },
      {
        path: '/user/account/wallet',
        element: <Navigate to='/' />,
      },
      {
        path: '/user/account/address',
        element: <Navigate to='/' />,
      },
      {
        path: '/user/account/password',
        element: <Navigate to='/' />,
      },
      {
        path: '/user/purchase',
        element: <Navigate to='/' />,
      },
      {
        path: '/user/refund',
        element: <Navigate to='/' />,
      },
      {
        path: '/cart',
        element: <Navigate to='/' />,
      },
      {
        path: '/checkout',
        element: <Navigate to='/' />,
      },
      {
        path: '/seller',
        element: <Navigate to='/' />,
      },
      {
        path: '/seller/shop',
        element: <Navigate to='/' />,
      },
      {
        path: '/seller/registration',
        element: <Navigate to='/' />,
      },
      {
        path: '/seller/shop/profile',
        element: <Navigate to='/' />,
      },
      {
        path: '/seller/shop/address',
        element: <Navigate to='/' />,
      },
      {
        path: '/seller/marketing',
        element: <Navigate to='/' />,
      },
      {
        path: '/seller/marketing/products',
        element: <Navigate to='/' />,
      },
      {
        path: '/seller/marketing/products/list',
        element: <Navigate to='/' />,
      },
      {
        path: '/seller/marketing/products/add',
        element: <Navigate to='/' />,
      },
      {
        path: '/seller/marketing/products/edit',
        element: <Navigate to='/' />,
      },
      {
        path: '/seller/marketing/vouchers',
        element: <Navigate to='/' />,
      },
      {
        path: '/seller/marketing/vouchers/list',
        element: <Navigate to='/' />,
      },
      {
        path: '/seller/marketing/vouchers/add',
        element: <Navigate to='/' />,
      },
      {
        path: '/seller/marketing/vouchers/edit',
        element: <Navigate to='/' />,
      },
      {
        path: '/seller/marketing/promotions',
        element: <Navigate to='/' />,
      },
      {
        path: '/seller/marketing/promotions/list',
        element: <Navigate to='/' />,
      },
      {
        path: '/seller/marketing/promotions/add',
        element: <Navigate to='/' />,
      },
      {
        path: '/seller/marketing/promotions/edit',
        element: <Navigate to='/' />,
      },
      {
        path: '/seller/orders/',
        element: <Navigate to='/' />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export const BUYER_ROUTES = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/categories',
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
        path: '/login',
        element: <Navigate to='/' />,
      },
      {
        path: '/register',
        element: <Navigate to='/' />,
      },
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
        path: '/seller',
        element: <Navigate to='/seller/registration' />,
      },
      {
        path: '/seller/shop',
        element: <Navigate to='/seller/registration' />,
      },
      {
        path: '/seller/registration',
        element: <SellerRegistration />,
      },
      {
        path: '/seller/shop/profile',
        element: <Navigate to='/seller/registration' />,
      },
      {
        path: '/seller/shop/address',
        element: <Navigate to='/seller/registration' />,
      },
      {
        path: '/seller/marketing',
        element: <Navigate to='/seller/registration' />,
      },
      {
        path: '/seller/marketing/products',
        element: <Navigate to='/seller/registration' />,
      },
      {
        path: '/seller/marketing/products/list',
        element: <Navigate to='/seller/registration' />,
      },
      {
        path: '/seller/marketing/products/add',
        element: <Navigate to='/seller/registration' />,
      },
      {
        path: '/seller/marketing/products/edit',
        element: <Navigate to='/seller/registration' />,
      },
      {
        path: '/seller/marketing/vouchers',
        element: <Navigate to='/seller/registration' />,
      },
      {
        path: '/seller/marketing/vouchers/list',
        element: <Navigate to='/seller/registration' />,
      },
      {
        path: '/seller/marketing/vouchers/add',
        element: <Navigate to='/seller/registration' />,
      },
      {
        path: '/seller/marketing/vouchers/edit',
        element: <Navigate to='/seller/registration' />,
      },
      {
        path: '/seller/marketing/promotions',
        element: <Navigate to='/seller/registration' />,
      },
      {
        path: '/seller/marketing/promotions/list',
        element: <Navigate to='/seller/registration' />,
      },
      {
        path: '/seller/marketing/promotions/add',
        element: <Navigate to='/seller/registration' />,
      },
      {
        path: '/seller/marketing/promotions/edit',
        element: <Navigate to='/seller/registration' />,
      },
      {
        path: '/seller/orders/',
        element: <Navigate to='/seller/registration' />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export const SELLER_ROUTES = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/categories',
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
        path: '/login',
        element: <Navigate to='/' />,
      },
      {
        path: '/register',
        element: <Navigate to='/' />,
      },
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
        path: '/seller',
        element: <Navigate to='/seller/shop/profile' />,
      },
      {
        path: '/seller/shop',
        element: <Navigate to='/seller/shop/profile' />,
      },
      {
        path: '/seller/registration',
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
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export const ADMIN_ROUTES = [
  {
    path: '/',
    element: <Navigate to='/admin' />,
  },
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
  {
    path: '*',
    element: <NotFound />,
  },
];
