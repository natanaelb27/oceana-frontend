import { ShopVoucherButton, ShopVoucherCardContainer, ShopVoucherCardContents, ShopVoucherCardDetails, ShopVoucherDesc, ShopVoucherTitle, ShopVoucherValidity } from './style';

const ShopVoucherCard = () => {
  return (
    <ShopVoucherCardContainer>
        <ShopVoucherCardContents>
            <ShopVoucherCardDetails>
                <ShopVoucherTitle>50% Discount</ShopVoucherTitle>
                <ShopVoucherDesc>Minimum Order Rp100.000</ShopVoucherDesc>
                <ShopVoucherValidity>Valid Until 31 Dec 2022</ShopVoucherValidity>
            </ShopVoucherCardDetails>
            <ShopVoucherButton>Claim</ShopVoucherButton>
        </ShopVoucherCardContents>
    </ShopVoucherCardContainer>
  );
};

export default ShopVoucherCard;