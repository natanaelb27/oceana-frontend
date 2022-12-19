// staggered grid effect constants
export const TILE_SIZE = 100;
export const DELAY_ANIMATION = 50;
export const MOBILE_WIDTH = 480;
// format: <MAIN>_<PAGE(optional)>_<COMPONENT/ELEMENT>
export const SCROLL_SLIDER = 360;
export const LIMIT_HOME_RECOMMENDED_PRODUCTS = 18;
export const LIMIT_SEARCH_PRODUCTS_LIST = 30;
export const LIMIT_SIMILAR_PRODUCTS_IN_PRODUCT_PAGE = 12;
export const LIMIT_SELLER_VOUCHER_LIST = 10;

export const VOUCHER_STATUS = {
  ALL: 'all',
  ONGOING: 'ongoing',
  UPCOMING: 'upcoming',
  ENDED: 'ended',
};

export const DISCOUNT_TYPE = {
  NOMINAL: 'nominal',
  PERCENTAGE: 'percentage',
};

export const LIMIT_TRANSACTION_HISTORY = 10;
export const DELIVERY_STATUS = {
  ALL: 'all',
  ONGOING: 'ongoing',
  PENDING_PAYMENT: 'pending payment',
  PENDING_SELLER: 'pending seller',
  ON_PROCESS: 'on process',
  OUT_FOR_DELIVERY: 'out for delivery',
  DELIVERED: 'delivered',
  COMPLAINED: 'complained',
  CANCELED: 'canceled',
  CANCELED_BUYER: 'canceled by buyer',
  CANCELED_SELLER: 'canceled by seller',
  CANCELED_SYSTEM: 'canceled by system',
  COMPLETED: 'completed',
};

export const WALLET_TRANSACTION_HISTORY_TYPE = {
  DEBIT: 'Debit',
  CREDIT: 'Credit',
};
