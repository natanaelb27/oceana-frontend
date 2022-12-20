export type UpdateUserCartRequest = {
  product_item_id: number;
  quantity: number;
};

export type IncrementUserCartRequest = {
  product_item_id: number;
  quantity: number;
  action: string;
}
