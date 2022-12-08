import { ShopVoucherButton, ShopVoucherCardContainer, ShopVoucherCardContents, ShopVoucherCardDetails, ShopVoucherDesc, ShopVoucherTitle, ShopVoucherValidity } from './style';

type ShopVoucherCardProp = {
  code: string;
  discountType: string;
};

const ShopVoucherCard = ({ code, discountType }: ShopVoucherCardProp) => {
  return (
    <ShopVoucherCardContainer>
        <ShopVoucherCardContents>
            <ShopVoucherCardDetails>
                <ShopVoucherTitle>{code}</ShopVoucherTitle>
                <ShopVoucherDesc>Minimum Order Rp100.000</ShopVoucherDesc>
                <ShopVoucherValidity>Valid Until 31 Dec 2022</ShopVoucherValidity>
            </ShopVoucherCardDetails>
            <ShopVoucherButton>Claim</ShopVoucherButton>
        </ShopVoucherCardContents>
    </ShopVoucherCardContainer>
  );
};

export default ShopVoucherCard;