import * as Yup from 'yup';
import { AnyObject } from 'yup/lib/object';

export const formikProcessDayAnndPreorderDay = (
  ctx: Yup.TestContext<AnyObject>,
  value: number | undefined
) => {
  if (!value) {
    return ctx.createError({
      message: 'Process Day cannot be empty',
    });
  }
  if (value < 2 || (value > 2 && value < 7) || value > 30) {
    return ctx.createError({
      message:
        'Process Day must be 2 days for non-Pre-order product or between 7 to 30 days for Pre-order product',
    });
  }
  return true;
};

export const formikPreorderDay = (
  ctx: Yup.TestContext<AnyObject>,
  value: number | undefined
) => {
<<<<<<< HEAD
  if (!value && value !== 0) {
=======
  if (!value) {
>>>>>>> f9032e488f89dc1e49835601ba4875a21a2ed93a
    return ctx.createError({
      message: 'Pre-Order Day cannot be empty',
    });
  } else if (value < 7 || value > 30) {
    return ctx.createError({
      message: 'Pre-Order Day must be between 7 to 30 days',
    });
  }
  return true;
};
