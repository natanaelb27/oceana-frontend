// staggered grid effect constants
export const TILE_SIZE = 100;
export const DELAY_ANIMATION = 50;
export const MOBILE_WIDTH = 480;
// format: <MAIN>_<PAGE(optional)>_<COMPONENT/ELEMENT>
export const SCROLL_SLIDER = 360;
export const LIMIT_HOME_RECOMMENDED_PRODUCTS = 18;
export const LIMIT_SEARCH_PRODUCTS_LIST = 30;
export const LIMIT_TRANSACTION_HISTORY = 10;
export const DELIVERY_STATUS = {
  ALL: 'All',
  ONGOING: 'Ongoing',
  PENDING_PAYMENT: 'Pending Payment',
  PENDING_SELLER: 'Pending Seller',
  ON_PROCESS: 'On Process',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  COMPLAINED: 'Complained',
  CANCELED: 'Canceled',
  CANCELED_BUYER: 'Canceled by Buyer',
  CANCELED_SELLER: 'Canceled by Seller',
  COMPLETED: 'Completed',
};
export const PHONE_REGEX =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

// status codes
export const STATUS_SEE_OTHER = 303;
