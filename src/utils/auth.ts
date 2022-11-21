import { Role } from '../types/role';

export const validateUserRole = (roleString: string | null) => {
  if (!roleString) {
    return Role.Guest;
  }

  if (roleString.length !== 3) {
    return Role.Guest;
  }

  if (roleString[0] === '1') {
    return Role.Admin;
  }

  if (roleString[1] === '1') {
    return Role.Seller;
  }

  if (roleString[2] === '1') {
    return Role.Buyer;
  }

  return Role.Guest;
};
