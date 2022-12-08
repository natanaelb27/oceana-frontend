/* eslint-disable @typescript-eslint/no-explicit-any */
import tw from 'tailwind-styled-components';

export const ShopDetailCardContainer = tw.div<any>`
    w-3/5
    my-10
`;

export const ShopDetailCardContent = tw.div<any>`
    py-5
    px-5
    flex
    flex-row
    text-white
    justify-between
`;

export const ShopDetailCardContentLeft = tw.div<any>`
    flex
    flex-wrap
    items-center
`;

export const ShopDetailCardContentRight = tw(ShopDetailCardContentLeft)<any>`
    flex-column
`;

export const RightContentAttribute = tw.div<any>`
    flex
    flex-col
    items-center
    justify-center
    mr-5
`;

export const RatingField = tw.div<any>`
    flex
    flex-row
    items-center
    justify-between
`;

export const ShopVouchersCardContainer = tw.div<any>`
    w-3/5
    px-3
    py-3
    border-solid
    border-2
    border-primary
    rounded
    mb-10
`;

export const ShopVouchersFlex = tw.div<any>`
    flex
`;

export const ShopVoucherCardContainer = tw.div<any>`
    bg-secondary
    text-white
    border-solid
    border-none
    border-2
    rounded
    p-5
    mr-3
    mb-5
    w-96
`;

export const ShopVoucherCardContents = tw.div<any>`
    flex
    flex-row
    justify-between
    items-center
`;

export const ShopVoucherCardDetails = tw.div<any>`
    flex
    flex-col
`;

export const ShopVoucherTitle = tw.h1<any>`
    font-bold
`;

export const ShopVoucherDesc = tw.h2<any>`
`;

export const ShopVoucherValidity = tw.h3<any>``;

export const ShopVoucherButton = tw.button<any>`
    btn-primary
    px-2
    py-3
    rounded
    font-bold
`;