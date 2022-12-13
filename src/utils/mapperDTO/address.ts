import { CreateAddressRequest } from '../../types/request';

export const toCreateAddress = (
  name: string,
  detail: string,
  subDistrictID: string
): CreateAddressRequest => ({
  name: name,
  detail: detail,
  sub_district_id: Number(subDistrictID),
});
