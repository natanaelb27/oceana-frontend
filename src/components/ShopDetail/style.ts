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