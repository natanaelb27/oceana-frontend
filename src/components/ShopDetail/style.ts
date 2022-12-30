/* eslint-disable @typescript-eslint/no-explicit-any */
import tw from 'tailwind-styled-components';

export const ShopDetailCardContainer = tw.div<any>`
    lg:w-3/5
    w-full
    my-10
    bg-secondary
`;

export const ShopDetailCardContent = tw.div<any>`
    py-5
    px-5
    flex
    flex-col
    lg:flex-row
    text-white
    lg:items-center
    lg:justify-between
`;

export const ShopDetailCardContentLeft = tw.div<any>`
    flex
    flex-wrap
    flex-row
    items-center
    lg:justify-center
    sm:justify-start
    lg:mb-0
    mb-10
`;

export const ShopDetailCardContentRight = tw(ShopDetailCardContentLeft)<any>`
    flex-row
    flex-wrap
    justify-between
    mb-0
`;

export const RightContentAttribute = tw.div<any>`
    flex
    flex-col
    flex-wrap
    items-center
    justify-center
    mr-1
    mb-3
    lg:mr-5
`;

export const RatingField = tw.div<any>`
    flex
    flex-row
    items-center
    justify-center
`;

export const ShopVouchersCardContainer = tw.div<any>`
    lg:w-3/5
    w-full
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

export const ShopCategoryFilter = tw.div<any>`
    w-56
    h-auto
    bg-base-200
    mr-14
    rounded-lg
    text-xl
    font-bold
    sticky
    top-0
`;
