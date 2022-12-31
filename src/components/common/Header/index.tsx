import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Divider,
  Dropdown,
  Form,
  Input,
  InputGroup,
  Navbar,
} from 'react-daisyui';
import { BiLogOutCircle } from 'react-icons/bi';
import { CgLogOut, CgProfile } from 'react-icons/cg';
import { FaPalette, FaSearch, FaShoppingCart } from 'react-icons/fa';
import { GoPerson } from 'react-icons/go';
import { HiHeart, HiMoon, HiSun } from 'react-icons/hi';
import { NavLink, useNavigate } from 'react-router-dom';

import { BsShop } from 'react-icons/bs';
import { TAG_TYPES } from '../../../constants/tags';
import { useLocalStorage, useScrollPosition } from '../../../hooks';
import { useLazyGetUserCartQuery } from '../../../store/services/cartService';
import { useLazyGetMyShopProfileQuery } from '../../../store/services/myShopService';
import {
  useLazyGetProfileQuery,
  useLogoutMutation,
} from '../../../store/services/profileService';
import { useLazyGetWalletDetailsQuery } from '../../../store/services/walletService';
import { selectRole, unsetCredentials } from '../../../store/slices/authSlice';
import { baseApi, useAppDispatch, useAppSelector } from '../../../store/store';
import { Role } from '../../../types/role';
import { validateUserRole } from '../../../utils/auth';
import ClassNames from '../../../utils/classnames';
import { toRupiah } from '../../../utils/convert';
import { roleCodeToText } from '../../../utils/roleCodeToText';
import Image from '../Image';
import NoData from '../NoData';

const Header = () => {
  const role = useAppSelector(selectRole);
  const scrollPosition = useScrollPosition();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();
  const [hoverTheme, setHoverTheme] = useState(false);
  const [hoverCart, setHoverCart] = useState(false);
  const [hoverProfile, setHoverProfile] = useState(false);
  const [hoverOverlay, setHoverOverlay] = useState(false);
  const [enableHoverGap, setEnableHoverGap] = useState(false);
  const [totalCartItems, setTotalCartItems] = useState(0);
  const [displaySearchBar, setDisplaySearchBar] = useState(false);
  const [getUserCart, { data: userCartData }] = useLazyGetUserCartQuery();
  const [getUserProfile, { data: userProfileData }] = useLazyGetProfileQuery();
  const [getUserWallet, { data: userWalletData }] =
    useLazyGetWalletDetailsQuery();
  const [
    getMyShopProfile,
    { data: myShopProfileData, isLoading: myShopProfileIsLoading },
  ] = useLazyGetMyShopProfileQuery();
  const [theme, setTheme] = useLocalStorage<string>(
    'theme',
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );

  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    if (
      role &&
      validateUserRole(role) !== Role.Guest &&
      validateUserRole(role) !== Role.Admin
    ) {
      getUserCart();
      getUserProfile();
      getUserWallet('');
      if (role.charAt(1) === '1') {
        getMyShopProfile();
      }
    }
  }, []);

  useEffect(() => {
    let totalItems = 0;
    if (userCartData && userCartData.data) {
      userCartData.data.forEach((merchant) => {
        merchant.products.forEach(() => {
          totalItems += 1;
        });
      });
      setTotalCartItems(totalItems);
    }
  }, [userCartData]);

  const hanldeSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleHoverTheme = () => {
    setHoverTheme(true);
  };

  const handleUnhoverTheme = () => {
    setHoverTheme(false);
  };

  const handleHoverCart = () => {
    if (role !== null) {
      setHoverCart(true);
      setHoverOverlay(true);
      setEnableHoverGap(true);
    }
  };

  const handleUnhoverCart = () => {
    setHoverCart(false);
    setHoverOverlay(false);
    setEnableHoverGap(false);
  };

  const handleHoverProfile = () => {
    setHoverProfile(true);
    setHoverOverlay(true);
    setEnableHoverGap(true);
  };

  const handleUnhoverProfile = () => {
    setHoverProfile(false);
    setHoverOverlay(false);
    setEnableHoverGap(false);
  };

  const handleHoverGap = () => {
    if (enableHoverGap === true) {
      setHoverOverlay(true);
    }
  };

  const handleUnhoverGap = () => {
    setHoverOverlay(false);
  };

  const renderHoverTheme = () => {
    if (!hoverTheme) {
      return null;
    }

    return (
      <div
        className='absolute bg-base-100 rounded-xl border-none shadow-lg top-8 right-0 z-50 transition-all duration-300'
        onMouseOver={handleHoverTheme}
        onMouseOut={handleUnhoverTheme}
      >
        <Card className='text-base-content w-64'>
          <Card.Body className='p-5 normal-case font-normal overflow-y-auto h-64'>
            <div className='grid grid-cols-1 gap-3'>
              <div className='outline-base-content overflow-hidden rounded-lg outline-2 outline-offset-2 hover:outline'>
                <div
                  data-theme='light'
                  onClick={() => handleThemeClick('light')}
                  className='bg-base-100 text-base-content w-full cursor-pointer font-sans'
                >
                  <div className='grid grid-cols-5 grid-rows-3'>
                    <div className='col-span-5 row-span-3 row-start-1 flex gap-1 py-3 px-4'>
                      <div className='flex-grow text-sm font-bold'>light</div>
                      <div className='flex flex-shrink-0 flex-wrap gap-1'>
                        <div className='bg-primary w-2 rounded'></div>
                        <div className='bg-secondary w-2 rounded'></div>
                        <div className='bg-accent w-2 rounded'></div>
                        <div className='bg-neutral w-2 rounded'></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='outline-base-content overflow-hidden rounded-lg outline-2 outline-offset-2 hover:outline'>
                <div
                  data-theme='dark'
                  onClick={() => handleThemeClick('dark')}
                  className='bg-base-100 text-base-content w-full cursor-pointer font-sans'
                >
                  <div className='grid grid-cols-5 grid-rows-3'>
                    <div className='col-span-5 row-span-3 row-start-1 flex gap-1 py-3 px-4'>
                      <div className='flex-grow text-sm font-bold'>dark</div>
                      <div className='flex flex-shrink-0 flex-wrap gap-1'>
                        <div className='bg-primary w-2 rounded'></div>
                        <div className='bg-secondary w-2 rounded'></div>
                        <div className='bg-accent w-2 rounded'></div>
                        <div className='bg-neutral w-2 rounded'></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='outline-base-content overflow-hidden rounded-lg outline-2 outline-offset-2 hover:outline'>
                <div
                  data-theme='cupcake'
                  onClick={() => handleThemeClick('cupcake')}
                  className='bg-base-100 text-base-content w-full cursor-pointer font-sans'
                >
                  <div className='grid grid-cols-5 grid-rows-3'>
                    <div className='col-span-5 row-span-3 row-start-1 flex gap-1 py-3 px-4'>
                      <div className='flex-grow text-sm font-bold'>cupcake</div>
                      <div className='flex flex-shrink-0 flex-wrap gap-1'>
                        <div className='bg-primary w-2 rounded'></div>
                        <div className='bg-secondary w-2 rounded'></div>
                        <div className='bg-accent w-2 rounded'></div>
                        <div className='bg-neutral w-2 rounded'></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='outline-base-content overflow-hidden rounded-lg outline-2 outline-offset-2 hover:outline'>
                <div
                  data-theme='bumblebee'
                  onClick={() => handleThemeClick('bumblebee')}
                  className='bg-base-100 text-base-content w-full cursor-pointer font-sans'
                >
                  <div className='grid grid-cols-5 grid-rows-3'>
                    <div className='col-span-5 row-span-3 row-start-1 flex gap-1 py-3 px-4'>
                      <div className='flex-grow text-sm font-bold'>
                        bumblebee
                      </div>
                      <div className='flex flex-shrink-0 flex-wrap gap-1'>
                        <div className='bg-primary w-2 rounded'></div>
                        <div className='bg-secondary w-2 rounded'></div>
                        <div className='bg-accent w-2 rounded'></div>
                        <div className='bg-neutral w-2 rounded'></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='outline-base-content overflow-hidden rounded-lg outline-2 outline-offset-2 hover:outline'>
                <div
                  data-theme='emerald'
                  onClick={() => handleThemeClick('emerald')}
                  className='bg-base-100 text-base-content w-full cursor-pointer font-sans'
                >
                  <div className='grid grid-cols-5 grid-rows-3'>
                    <div className='col-span-5 row-span-3 row-start-1 flex gap-1 py-3 px-4'>
                      <div className='flex-grow text-sm font-bold'>emerald</div>
                      <div className='flex flex-shrink-0 flex-wrap gap-1'>
                        <div className='bg-primary w-2 rounded'></div>
                        <div className='bg-secondary w-2 rounded'></div>
                        <div className='bg-accent w-2 rounded'></div>
                        <div className='bg-neutral w-2 rounded'></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='outline-base-content overflow-hidden rounded-lg outline-2 outline-offset-2 hover:outline'>
                <div
                  data-theme='corporate'
                  onClick={() => handleThemeClick('corporate')}
                  className='bg-base-100 text-base-content w-full cursor-pointer font-sans'
                >
                  <div className='grid grid-cols-5 grid-rows-3'>
                    <div className='col-span-5 row-span-3 row-start-1 flex gap-1 py-3 px-4'>
                      <div className='flex-grow text-sm font-bold'>
                        corporate
                      </div>
                      <div className='flex flex-shrink-0 flex-wrap gap-1'>
                        <div className='bg-primary w-2 rounded'></div>
                        <div className='bg-secondary w-2 rounded'></div>
                        <div className='bg-accent w-2 rounded'></div>
                        <div className='bg-neutral w-2 rounded'></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='outline-base-content overflow-hidden rounded-lg outline-2 outline-offset-2 hover:outline'>
                <div
                  data-theme='synthwave'
                  onClick={() => handleThemeClick('synthwave')}
                  className='bg-base-100 text-base-content w-full cursor-pointer font-sans'
                >
                  <div className='grid grid-cols-5 grid-rows-3'>
                    <div className='col-span-5 row-span-3 row-start-1 flex gap-1 py-3 px-4'>
                      <div className='flex-grow text-sm font-bold'>
                        synthwave
                      </div>
                      <div className='flex flex-shrink-0 flex-wrap gap-1'>
                        <div className='bg-primary w-2 rounded'></div>
                        <div className='bg-secondary w-2 rounded'></div>
                        <div className='bg-accent w-2 rounded'></div>
                        <div className='bg-neutral w-2 rounded'></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='outline-base-content overflow-hidden rounded-lg outline-2 outline-offset-2 hover:outline'>
                <div
                  data-theme='retro'
                  onClick={() => handleThemeClick('retro')}
                  className='bg-base-100 text-base-content w-full cursor-pointer font-sans'
                >
                  <div className='grid grid-cols-5 grid-rows-3'>
                    <div className='col-span-5 row-span-3 row-start-1 flex gap-1 py-3 px-4'>
                      <div className='flex-grow text-sm font-bold'>retro</div>
                      <div className='flex flex-shrink-0 flex-wrap gap-1'>
                        <div className='bg-primary w-2 rounded'></div>
                        <div className='bg-secondary w-2 rounded'></div>
                        <div className='bg-accent w-2 rounded'></div>
                        <div className='bg-neutral w-2 rounded'></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='outline-base-content overflow-hidden rounded-lg outline-2 outline-offset-2 hover:outline'>
                <div
                  data-theme='cyberpunk'
                  onClick={() => handleThemeClick('cyberpunk')}
                  className='bg-base-100 text-base-content w-full cursor-pointer font-sans'
                >
                  <div className='grid grid-cols-5 grid-rows-3'>
                    <div className='col-span-5 row-span-3 row-start-1 flex gap-1 py-3 px-4'>
                      <div className='flex-grow text-sm font-bold'>
                        cyberpunk
                      </div>
                      <div className='flex flex-shrink-0 flex-wrap gap-1'>
                        <div className='bg-primary w-2 rounded'></div>
                        <div className='bg-secondary w-2 rounded'></div>
                        <div className='bg-accent w-2 rounded'></div>
                        <div className='bg-neutral w-2 rounded'></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='outline-base-content overflow-hidden rounded-lg outline-2 outline-offset-2 hover:outline'>
                <div
                  data-theme='valentine'
                  onClick={() => handleThemeClick('valentine')}
                  className='bg-base-100 text-base-content w-full cursor-pointer font-sans'
                >
                  <div className='grid grid-cols-5 grid-rows-3'>
                    <div className='col-span-5 row-span-3 row-start-1 flex gap-1 py-3 px-4'>
                      <div className='flex-grow text-sm font-bold'>
                        valentine
                      </div>
                      <div className='flex flex-shrink-0 flex-wrap gap-1'>
                        <div className='bg-primary w-2 rounded'></div>
                        <div className='bg-secondary w-2 rounded'></div>
                        <div className='bg-accent w-2 rounded'></div>
                        <div className='bg-neutral w-2 rounded'></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='outline-base-content overflow-hidden rounded-lg outline-2 outline-offset-2 hover:outline'>
                <div
                  data-theme='halloween'
                  onClick={() => handleThemeClick('halloween')}
                  className='bg-base-100 text-base-content w-full cursor-pointer font-sans'
                >
                  <div className='grid grid-cols-5 grid-rows-3'>
                    <div className='col-span-5 row-span-3 row-start-1 flex gap-1 py-3 px-4'>
                      <div className='flex-grow text-sm font-bold'>
                        halloween
                      </div>
                      <div className='flex flex-shrink-0 flex-wrap gap-1'>
                        <div className='bg-primary w-2 rounded'></div>
                        <div className='bg-secondary w-2 rounded'></div>
                        <div className='bg-accent w-2 rounded'></div>
                        <div className='bg-neutral w-2 rounded'></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='outline-base-content overflow-hidden rounded-lg outline-2 outline-offset-2 hover:outline'>
                <div
                  data-theme='garden'
                  onClick={() => handleThemeClick('garden')}
                  className='bg-base-100 text-base-content w-full cursor-pointer font-sans'
                >
                  <div className='grid grid-cols-5 grid-rows-3'>
                    <div className='col-span-5 row-span-3 row-start-1 flex gap-1 py-3 px-4'>
                      <div className='flex-grow text-sm font-bold'>garden</div>
                      <div className='flex flex-shrink-0 flex-wrap gap-1'>
                        <div className='bg-primary w-2 rounded'></div>
                        <div className='bg-secondary w-2 rounded'></div>
                        <div className='bg-accent w-2 rounded'></div>
                        <div className='bg-neutral w-2 rounded'></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='outline-base-content overflow-hidden rounded-lg outline-2 outline-offset-2 hover:outline'>
                <div
                  data-theme='forest'
                  onClick={() => handleThemeClick('forest')}
                  className='bg-base-100 text-base-content w-full cursor-pointer font-sans'
                >
                  <div className='grid grid-cols-5 grid-rows-3'>
                    <div className='col-span-5 row-span-3 row-start-1 flex gap-1 py-3 px-4'>
                      <div className='flex-grow text-sm font-bold'>forest</div>
                      <div className='flex flex-shrink-0 flex-wrap gap-1'>
                        <div className='bg-primary w-2 rounded'></div>
                        <div className='bg-secondary w-2 rounded'></div>
                        <div className='bg-accent w-2 rounded'></div>
                        <div className='bg-neutral w-2 rounded'></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='outline-base-content overflow-hidden rounded-lg outline-2 outline-offset-2 hover:outline'>
                <div
                  data-theme='aqua'
                  onClick={() => handleThemeClick('aqua')}
                  className='bg-base-100 text-base-content w-full cursor-pointer font-sans'
                >
                  <div className='grid grid-cols-5 grid-rows-3'>
                    <div className='col-span-5 row-span-3 row-start-1 flex gap-1 py-3 px-4'>
                      <div className='flex-grow text-sm font-bold'>aqua</div>
                      <div className='flex flex-shrink-0 flex-wrap gap-1'>
                        <div className='bg-primary w-2 rounded'></div>
                        <div className='bg-secondary w-2 rounded'></div>
                        <div className='bg-accent w-2 rounded'></div>
                        <div className='bg-neutral w-2 rounded'></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='outline-base-content overflow-hidden rounded-lg outline-2 outline-offset-2 hover:outline'>
                <div
                  data-theme='lofi'
                  onClick={() => handleThemeClick('lofi')}
                  className='bg-base-100 text-base-content w-full cursor-pointer font-sans'
                >
                  <div className='grid grid-cols-5 grid-rows-3'>
                    <div className='col-span-5 row-span-3 row-start-1 flex gap-1 py-3 px-4'>
                      <div className='flex-grow text-sm font-bold'>lofi</div>
                      <div className='flex flex-shrink-0 flex-wrap gap-1'>
                        <div className='bg-primary w-2 rounded'></div>
                        <div className='bg-secondary w-2 rounded'></div>
                        <div className='bg-accent w-2 rounded'></div>
                        <div className='bg-neutral w-2 rounded'></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='outline-base-content overflow-hidden rounded-lg outline-2 outline-offset-2 hover:outline'>
                <div
                  data-theme='pastel'
                  onClick={() => handleThemeClick('pastel')}
                  className='bg-base-100 text-base-content w-full cursor-pointer font-sans'
                >
                  <div className='grid grid-cols-5 grid-rows-3'>
                    <div className='col-span-5 row-span-3 row-start-1 flex gap-1 py-3 px-4'>
                      <div className='flex-grow text-sm font-bold'>pastel</div>
                      <div className='flex flex-shrink-0 flex-wrap gap-1'>
                        <div className='bg-primary w-2 rounded'></div>
                        <div className='bg-secondary w-2 rounded'></div>
                        <div className='bg-accent w-2 rounded'></div>
                        <div className='bg-neutral w-2 rounded'></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='outline-base-content overflow-hidden rounded-lg outline-2 outline-offset-2 hover:outline'>
                <div
                  data-theme='fantasy'
                  onClick={() => handleThemeClick('fantasy')}
                  className='bg-base-100 text-base-content w-full cursor-pointer font-sans'
                >
                  <div className='grid grid-cols-5 grid-rows-3'>
                    <div className='col-span-5 row-span-3 row-start-1 flex gap-1 py-3 px-4'>
                      <div className='flex-grow text-sm font-bold'>fantasy</div>
                      <div className='flex flex-shrink-0 flex-wrap gap-1'>
                        <div className='bg-primary w-2 rounded'></div>
                        <div className='bg-secondary w-2 rounded'></div>
                        <div className='bg-accent w-2 rounded'></div>
                        <div className='bg-neutral w-2 rounded'></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='outline-base-content overflow-hidden rounded-lg outline-2 outline-offset-2 hover:outline'>
                <div
                  data-theme='wireframe'
                  onClick={() => handleThemeClick('wireframe')}
                  className='bg-base-100 text-base-content w-full cursor-pointer font-sans'
                >
                  <div className='grid grid-cols-5 grid-rows-3'>
                    <div className='col-span-5 row-span-3 row-start-1 flex gap-1 py-3 px-4'>
                      <div className='flex-grow text-sm font-bold'>
                        wireframe
                      </div>
                      <div className='flex flex-shrink-0 flex-wrap gap-1'>
                        <div className='bg-primary w-2 rounded'></div>
                        <div className='bg-secondary w-2 rounded'></div>
                        <div className='bg-accent w-2 rounded'></div>
                        <div className='bg-neutral w-2 rounded'></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='outline-base-content overflow-hidden rounded-lg outline-2 outline-offset-2 hover:outline'>
                <div
                  data-theme='black'
                  onClick={() => handleThemeClick('black')}
                  className='bg-base-100 text-base-content w-full cursor-pointer font-sans'
                >
                  <div className='grid grid-cols-5 grid-rows-3'>
                    <div className='col-span-5 row-span-3 row-start-1 flex gap-1 py-3 px-4'>
                      <div className='flex-grow text-sm font-bold'>black</div>
                      <div className='flex flex-shrink-0 flex-wrap gap-1'>
                        <div className='bg-primary w-2 rounded'></div>
                        <div className='bg-secondary w-2 rounded'></div>
                        <div className='bg-accent w-2 rounded'></div>
                        <div className='bg-neutral w-2 rounded'></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='outline-base-content overflow-hidden rounded-lg outline-2 outline-offset-2 hover:outline'>
                <div
                  data-theme='luxury'
                  onClick={() => handleThemeClick('luxury')}
                  className='bg-base-100 text-base-content w-full cursor-pointer font-sans'
                >
                  <div className='grid grid-cols-5 grid-rows-3'>
                    <div className='col-span-5 row-span-3 row-start-1 flex gap-1 py-3 px-4'>
                      <div className='flex-grow text-sm font-bold'>luxury</div>
                      <div className='flex flex-shrink-0 flex-wrap gap-1'>
                        <div className='bg-primary w-2 rounded'></div>
                        <div className='bg-secondary w-2 rounded'></div>
                        <div className='bg-accent w-2 rounded'></div>
                        <div className='bg-neutral w-2 rounded'></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='outline-base-content overflow-hidden rounded-lg outline-2 outline-offset-2 hover:outline'>
                <div
                  data-theme='dracula'
                  onClick={() => handleThemeClick('dracula')}
                  className='bg-base-100 text-base-content w-full cursor-pointer font-sans'
                >
                  <div className='grid grid-cols-5 grid-rows-3'>
                    <div className='col-span-5 row-span-3 row-start-1 flex gap-1 py-3 px-4'>
                      <div className='flex-grow text-sm font-bold'>dracula</div>
                      <div className='flex flex-shrink-0 flex-wrap gap-1'>
                        <div className='bg-primary w-2 rounded'></div>
                        <div className='bg-secondary w-2 rounded'></div>
                        <div className='bg-accent w-2 rounded'></div>
                        <div className='bg-neutral w-2 rounded'></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='outline-base-content overflow-hidden rounded-lg outline-2 outline-offset-2 hover:outline'>
                <div
                  data-theme='cmyk'
                  onClick={() => handleThemeClick('cmyk')}
                  className='bg-base-100 text-base-content w-full cursor-pointer font-sans'
                >
                  <div className='grid grid-cols-5 grid-rows-3'>
                    <div className='col-span-5 row-span-3 row-start-1 flex gap-1 py-3 px-4'>
                      <div className='flex-grow text-sm font-bold'>cmyk</div>
                      <div className='flex flex-shrink-0 flex-wrap gap-1'>
                        <div className='bg-primary w-2 rounded'></div>
                        <div className='bg-secondary w-2 rounded'></div>
                        <div className='bg-accent w-2 rounded'></div>
                        <div className='bg-neutral w-2 rounded'></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='outline-base-content overflow-hidden rounded-lg outline-2 outline-offset-2 hover:outline'>
                <div
                  data-theme='autumn'
                  onClick={() => handleThemeClick('autumn')}
                  className='bg-base-100 text-base-content w-full cursor-pointer font-sans'
                >
                  <div className='grid grid-cols-5 grid-rows-3'>
                    <div className='col-span-5 row-span-3 row-start-1 flex gap-1 py-3 px-4'>
                      <div className='flex-grow text-sm font-bold'>autumn</div>
                      <div className='flex flex-shrink-0 flex-wrap gap-1'>
                        <div className='bg-primary w-2 rounded'></div>
                        <div className='bg-secondary w-2 rounded'></div>
                        <div className='bg-accent w-2 rounded'></div>
                        <div className='bg-neutral w-2 rounded'></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='outline-base-content overflow-hidden rounded-lg outline-2 outline-offset-2 hover:outline'>
                <div
                  data-theme='business'
                  onClick={() => handleThemeClick('business')}
                  className='bg-base-100 text-base-content w-full cursor-pointer font-sans'
                >
                  <div className='grid grid-cols-5 grid-rows-3'>
                    <div className='col-span-5 row-span-3 row-start-1 flex gap-1 py-3 px-4'>
                      <div className='flex-grow text-sm font-bold'>
                        business
                      </div>
                      <div className='flex flex-shrink-0 flex-wrap gap-1'>
                        <div className='bg-primary w-2 rounded'></div>
                        <div className='bg-secondary w-2 rounded'></div>
                        <div className='bg-accent w-2 rounded'></div>
                        <div className='bg-neutral w-2 rounded'></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='outline-base-content overflow-hidden rounded-lg outline-2 outline-offset-2 hover:outline'>
                <div
                  data-theme='acid'
                  onClick={() => handleThemeClick('acid')}
                  className='bg-base-100 text-base-content w-full cursor-pointer font-sans'
                >
                  <div className='grid grid-cols-5 grid-rows-3'>
                    <div className='col-span-5 row-span-3 row-start-1 flex gap-1 py-3 px-4'>
                      <div className='flex-grow text-sm font-bold'>acid</div>
                      <div className='flex flex-shrink-0 flex-wrap gap-1'>
                        <div className='bg-primary w-2 rounded'></div>
                        <div className='bg-secondary w-2 rounded'></div>
                        <div className='bg-accent w-2 rounded'></div>
                        <div className='bg-neutral w-2 rounded'></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='outline-base-content overflow-hidden rounded-lg outline-2 outline-offset-2 hover:outline'>
                <div
                  data-theme='lemonade'
                  onClick={() => handleThemeClick('lemonade')}
                  className='bg-base-100 text-base-content w-full cursor-pointer font-sans'
                >
                  <div className='grid grid-cols-5 grid-rows-3'>
                    <div className='col-span-5 row-span-3 row-start-1 flex gap-1 py-3 px-4'>
                      <div className='flex-grow text-sm font-bold'>
                        lemonade
                      </div>
                      <div className='flex flex-shrink-0 flex-wrap gap-1'>
                        <div className='bg-primary w-2 rounded'></div>
                        <div className='bg-secondary w-2 rounded'></div>
                        <div className='bg-accent w-2 rounded'></div>
                        <div className='bg-neutral w-2 rounded'></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='outline-base-content overflow-hidden rounded-lg outline-2 outline-offset-2 hover:outline'>
                <div
                  data-theme='night'
                  onClick={() => handleThemeClick('night')}
                  className='bg-base-100 text-base-content w-full cursor-pointer font-sans'
                >
                  <div className='grid grid-cols-5 grid-rows-3'>
                    <div className='col-span-5 row-span-3 row-start-1 flex gap-1 py-3 px-4'>
                      <div className='flex-grow text-sm font-bold'>night</div>
                      <div className='flex flex-shrink-0 flex-wrap gap-1'>
                        <div className='bg-primary w-2 rounded'></div>
                        <div className='bg-secondary w-2 rounded'></div>
                        <div className='bg-accent w-2 rounded'></div>
                        <div className='bg-neutral w-2 rounded'></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='outline-base-content overflow-hidden rounded-lg outline-2 outline-offset-2 hover:outline'>
                <div
                  data-theme='coffee'
                  onClick={() => handleThemeClick('coffee')}
                  className='bg-base-100 text-base-content w-full cursor-pointer font-sans'
                >
                  <div className='grid grid-cols-5 grid-rows-3'>
                    <div className='col-span-5 row-span-3 row-start-1 flex gap-1 py-3 px-4'>
                      <div className='flex-grow text-sm font-bold'>coffee</div>
                      <div className='flex flex-shrink-0 flex-wrap gap-1'>
                        <div className='bg-primary w-2 rounded'></div>
                        <div className='bg-secondary w-2 rounded'></div>
                        <div className='bg-accent w-2 rounded'></div>
                        <div className='bg-neutral w-2 rounded'></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='outline-base-content overflow-hidden rounded-lg outline-2 outline-offset-2 hover:outline'>
                <div
                  data-theme='winter'
                  onClick={() => handleThemeClick('winter')}
                  className='bg-base-100 text-base-content w-full cursor-pointer font-sans'
                >
                  <div className='grid grid-cols-5 grid-rows-3'>
                    <div className='col-span-5 row-span-3 row-start-1 flex gap-1 py-3 px-4'>
                      <div className='flex-grow text-sm font-bold'>winter</div>
                      <div className='flex flex-shrink-0 flex-wrap gap-1'>
                        <div className='bg-primary w-2 rounded'></div>
                        <div className='bg-secondary w-2 rounded'></div>
                        <div className='bg-accent w-2 rounded'></div>
                        <div className='bg-neutral w-2 rounded'></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  };

  const renderHoverCart = () => {
    if (!userCartData?.data) {
      return null;
    }

    let totalItems = 0;

    return (
      <div
        className={ClassNames([
          'transition-500',
          hoverCart ? 'opacity-100 scale-100 top-8' : 'opacity-0 scale-0',
        ])}
      >
        {userCartData.data.length === 0 ? (
          <div
            className='absolute bg-base-100 rounded-xl border-none shadow-lg top-0 right-0 z-50 transition-all duration-300'
            onMouseOver={handleHoverCart}
            onMouseOut={handleUnhoverCart}
          >
            <Card>
              <Card.Body className='text-base-content'>
                <NoData
                  message='No products in cart, care to add some?'
                  title='Empty Cart'
                />
              </Card.Body>
            </Card>
          </div>
        ) : (
          <div
            className='absolute bg-base-100 rounded-xl border-none shadow-lg top-0 right-0 z-50 transition-all duration-300'
            onMouseOver={handleHoverCart}
            onMouseOut={handleUnhoverCart}
          >
            <Card className=' text-base-content w-96'>
              <Card.Body className='p-5 normal-case font-normal'>
                <div className='flex justify-between'>
                  <div className='font-bold'>Cart</div>
                  <NavLink
                    to='/cart'
                    className=' hover:text-primary transition-all duration-200'
                    onClick={() => handleUnhoverCart()}
                  >
                    <div className='font-bold'>View Cart</div>
                  </NavLink>
                </div>
                <div>
                  {userCartData.data.map((merchant) => {
                    return merchant.products.map((product, i) => {
                      totalItems += 1;
                      if (totalItems <= 4) {
                        return (
                          <React.Fragment key={i}>
                            <Divider className='m-0' />
                            <NavLink
                              to='/cart'
                              className='hover:text-primary transition-all duration-200'
                              onClick={() => handleUnhoverCart()}
                            >
                              <div className='flex items-center justify-between text-sm mb-2'>
                                <div className='flex mr-5'>
                                  <Image
                                    src={product.product_media_url}
                                    className=' rounded-xl w-16 h-16'
                                  />
                                  <div className='ml-2 w-44'>
                                    <div className='font-bold truncate'>
                                      {product.product_name}
                                    </div>
                                    <div className='text-xs font-light'>
                                      {product.quantity} items (
                                      {product.product_weight}
                                      gr) {product.product_variation}
                                    </div>
                                  </div>
                                </div>
                                <div className='font-bold'>
                                  {toRupiah(product.price_after_discount)}
                                </div>
                              </div>
                            </NavLink>
                          </React.Fragment>
                        );
                      }
                    });
                  })}
                </div>
              </Card.Body>
            </Card>
          </div>
        )}
      </div>
    );
  };

  const renderHoverProfile = () => {
    if (
      !userProfileData?.data ||
      !userWalletData?.data ||
      myShopProfileIsLoading
    ) {
      return null;
    }

    return (
      <div
        className={ClassNames([
          'transition-500',
          hoverProfile ? 'opacity-100 scale-100 top-8' : 'opacity-0 scale-0',
        ])}
      >
        <div
          className='absolute bg-base-100 rounded-xl border-none shadow-lg top-0 right-0 z-50 transition-all duration-300'
          onMouseOver={handleHoverProfile}
          onMouseOut={handleUnhoverProfile}
        >
          <Card className='text-base-content w-96 p-5 normal-case font-normal gap-1'>
            <div
              className='text-lg p-2 rounded-lg shadow-md mb-1 hover:bg-base-200 hover:cursor-pointer border-r-4 border-r-secondary transition-all duration-200'
              onClick={handleProfileClick}
            >
              <div className='flex items-center'>
                {userProfileData.data.photo ? (
                  <Avatar
                    size='sm'
                    shape='circle'
                    src={userProfileData.data.photo}
                    className='mr-2'
                  />
                ) : (
                  <Avatar
                    size='sm'
                    shape='circle'
                    letters={userProfileData.data.full_name[0]}
                    className='mr-2'
                  />
                )}

                <div>
                  <div className='font-bold'>
                    {userProfileData.data.full_name}
                  </div>
                  <div className='text-sm'>
                    @{userProfileData.data.username}
                  </div>
                  <div className='text-sm'>
                    {roleCodeToText(userProfileData.data.role)}
                  </div>
                </div>
              </div>
            </div>
            <div
              className='text-lg p-2 rounded-lg shadow-md mb-1 hover:bg-base-200 hover:cursor-pointer border-r-4 border-r-secondary transition-all duration-200'
              onClick={handleWalletClick}
            >
              <div className='flex justify-between mb-1'>
                <div className='font-bold'>Wallet Balance</div>
                <div className='hover:text-primary'>
                  {toRupiah(userWalletData.data.balance)}
                </div>
              </div>
              {!userWalletData.data.is_active && (
                <div className='text-red-500 text-xs font-bold'>
                  Activate your wallet
                </div>
              )}
              <div className='text-xs'>Wallet ID: {userWalletData.data.id}</div>
            </div>
            <div
              className='text-lg p-2 rounded-lg shadow-md mb-1 flex flex-row hover:bg-base-200 hover:cursor-pointer border-r-4 border-r-secondary transition-all duration-200'
              onClick={handleWishlistClick}
            >
              <div className='w-16 flex items-center justify-center'>
                <HiHeart className='text-4xl text-secondary' />
              </div>
              <div className='flex flex-col'>
                <span className='font-bold'>Wishlist</span>
                <span className='text-xs'>
                  List of all your favorite products
                </span>
              </div>
            </div>
            {myShopProfileData?.data ? (
              <div
                className='text-lg p-2 rounded-lg shadow-md bg-base-100 hover:bg-base-300 hover:cursor-pointer border-r-4 border-r-secondary transition-all duration-200'
                onClick={handleShopClick}
              >
                <div className='flex items-center'>
                  {myShopProfileData.data.photo ? (
                    <Avatar
                      src={myShopProfileData?.data.photo}
                      shape='circle'
                      size='sm'
                      className='mr-2'
                    />
                  ) : (
                    <Avatar
                      letters={myShopProfileData.data.name[0]}
                      shape='circle'
                      size='sm'
                      className='mr-2'
                    />
                  )}

                  <div>
                    <div className='font-bold'>
                      {myShopProfileData?.data.name}
                    </div>
                    <div className='text-sm hover:text-primary'>View Shop</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className='text-lg p-2 rounded-lg shadow-md border-r-4 border-r-secondary'>
                <div className='text-sm mb-1 font-bold'>
                  Don&apos;t have a shop yet?
                </div>
                <Button
                  color='primary'
                  className='normal-case shadow-md'
                  onClick={handleRegisterShopClick}
                >
                  Open a Shop for Free
                </Button>
              </div>
            )}
            <Divider className='mt-2 mb-0' />
            <div className='flex justify-center'>
              <div
                className='flex gap-2 shadow-lg p-2.5 hover:cursor-pointer hover:bg-primary transition-all duration-200 rounded-lg hover:text-white border-b-2 border-b-secondary'
                onClick={handleLogoutClick}
              >
                Logout <BiLogOutCircle size='1.5em' />
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  };

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate({
      pathname: '/search',
      search: `?q=${search}`,
    });
  };

  const handleThemeClick = (theme: string) => {
    document.getElementsByTagName('html')[0].setAttribute('data-theme', theme);

    setTheme(theme);
  };

  const handleProfileClick = () => {
    navigate('/user/account/profile');
    setHoverProfile(false);
  };

  const handleWalletClick = () => {
    navigate('/user/account/wallet');
    setHoverProfile(false);
  };

  const handleWishlistClick = () => {
    navigate('/user/wishlist');
    setHoverProfile(false);
  };

  const handleRegisterShopClick = () => {
    navigate('/seller');
    setHoverProfile(false);
  };

  const handleLogoutClick = async () => {
    await dispatch(unsetCredentials());
    await logout()
      .unwrap()
      .then(() => {
        dispatch(baseApi.util.invalidateTags(TAG_TYPES));
      });
    navigate('/');
  };

  const handleShopClick = () => {
    navigate('/seller');
    setHoverProfile(false);
  };

  return (
    <>
      <div
        className={`${
          hoverOverlay
            ? 'opacity-100 w-full h-full transition-bg-blur-hover-on'
            : ' opacity-0 h-0 transition-bg-blur-hover-off'
        } fixed w-full h-full overlay bg-black bg-opacity-40 backdrop-blur-sm z-30`}
      ></div>
      <header
        className={`sticky top-0 z-30 py-2 w-full component-preview items-center justify-center gap-2 font-sans transition-all duration-100 ${
          scrollPosition > 0
            ? 'bg-base-100 text-base-content shadow-sm bg-opacity-80 backdrop-blur'
            : 'bg-primary text-primary-content'
        }`}
      >
        <div className='container mx-auto'>
          <Navbar className='hidden md:flex'>
            <div className='flex-none mr-4'>
              <NavLink to='/'>
                <Button className='text-xl normal-case' color='ghost'>
                  <span className='font-main font-bold italic'>Oceana</span>
                </Button>
              </NavLink>
            </div>
            <div className='flex-1'>
              {validateUserRole(role) !== Role.Admin && (
                <Form onSubmit={handleSearchSubmit} className='w-full'>
                  <InputGroup>
                    <Input
                      type='text'
                      placeholder='Search...'
                      color='ghost'
                      className='focus:text-base-content bg-base-100 placeholder:text-base-100 bg-opacity-[13%] text-base-100 w-full border-none'
                      value={search}
                      onChange={hanldeSearchChange}
                    />
                    <Button shape='square' color='ghost'>
                      <FaSearch />
                    </Button>
                  </InputGroup>
                </Form>
              )}
            </div>
            <div className='flex-none ml-4 gap-2'>
              <div className='relative'>
                <Button
                  color='ghost'
                  size='sm'
                  onMouseOver={handleHoverTheme}
                  onMouseOut={handleUnhoverTheme}
                >
                  <FaPalette className='text-lg' />
                </Button>
                {renderHoverTheme()}
              </div>

              {validateUserRole(role) !== Role.Admin && (
                <div
                  className='relative pr-2'
                  onMouseOver={handleHoverGap}
                  onMouseOut={handleUnhoverGap}
                >
                  <NavLink to='/cart' className=''>
                    <Button
                      color='ghost'
                      size='sm'
                      onMouseOver={handleHoverCart}
                      onMouseOut={handleUnhoverCart}
                    >
                      <FaShoppingCart className='text-lg' />
                      {totalCartItems > 0 && (
                        <Badge
                          className='absolute ml-6 mb-4 bg-red-600 border-none text-white text-xs p-2'
                          size='xs'
                        >
                          {totalCartItems}
                        </Badge>
                      )}
                    </Button>
                  </NavLink>
                  {renderHoverCart()}
                </div>
              )}
              {!role ? (
                <>
                  <NavLink to='/login'>
                    <Button color='ghost'>Login</Button>
                  </NavLink>
                  <NavLink to='/register'>
                    <Button color='ghost'>Register</Button>
                  </NavLink>
                </>
              ) : validateUserRole(role) === Role.Buyer ||
                validateUserRole(role) === Role.Seller ? (
                <div
                  className='relative'
                  onMouseOver={handleHoverProfile}
                  onMouseOut={handleUnhoverProfile}
                >
                  <div onClick={handleProfileClick}>
                    <Button color='ghost' size='sm'>
                      <GoPerson className='text-lg' />
                    </Button>
                  </div>
                  {renderHoverProfile()}
                </div>
              ) : (
                <Button
                  color='ghost'
                  startIcon={<CgLogOut className='text-xl' />}
                  onClick={handleLogoutClick}
                >
                  Logout
                </Button>
              )}
            </div>
          </Navbar>
          <Navbar className='flex md:hidden'>
            <div className='flex w-full justify-between'>
              <div className='flex'>
                <div
                  className={`self-start mr-4  ${
                    displaySearchBar ? 'w-0' : 'w-full'
                  }`}
                >
                  <NavLink to='/'>
                    <Button className='text-xl normal-case p-0' color='ghost'>
                      <span
                        className={
                          'font-main font-bold italic transition-all px-2' +
                          ClassNames([
                            displaySearchBar
                              ? 'text-[0px] opacity-30'
                              : 'opacity-100',
                          ])
                        }
                      >
                        Oceana
                      </span>
                    </Button>
                  </NavLink>
                </div>
              </div>

              <div className='flex flex-row flex-nowrap gap-1 items-center'>
                {validateUserRole(role) !== Role.Admin && (
                  <div className='flex'>
                    <Form onSubmit={handleSearchSubmit}>
                      <Input
                        type='text'
                        placeholder='Search...'
                        color='ghost'
                        className={`bg-base-100 bg-opacity-[13%] w-full border-none text-base-100 rounded-r-none focus:text-base-content placeholder:text-base-100 transition-all ${
                          displaySearchBar
                            ? 'w-full p-5 opacity-100'
                            : 'w-0 p-0 opacity-30'
                        }`}
                        value={search}
                        onChange={hanldeSearchChange}
                      />
                    </Form>
                    <Button
                      className={displaySearchBar ? 'rounded-l-none' : ''}
                      shape='square'
                      color='ghost'
                      onClick={() => setDisplaySearchBar(!displaySearchBar)}
                    >
                      <FaSearch />
                    </Button>
                  </div>
                )}

                {theme === 'light' ? (
                  <Button
                    shape='circle'
                    color='ghost'
                    size='sm'
                    onClick={() => handleThemeClick('dark')}
                  >
                    <HiSun className='text-lg' />
                  </Button>
                ) : (
                  <Button
                    shape='circle'
                    color='ghost'
                    size='sm'
                    onClick={() => handleThemeClick('light')}
                  >
                    <HiMoon className='text-lg' />
                  </Button>
                )}

                {validateUserRole(role) !== Role.Admin && (
                  <NavLink to='/cart'>
                    <Button color='ghost' size='sm'>
                      <FaShoppingCart className='text-lg' />
                      {totalCartItems > 0 && (
                        <Badge
                          className='absolute ml-6 mb-4 bg-red-600 border-none text-white text-xs p-2'
                          size='xs'
                        >
                          {totalCartItems}
                        </Badge>
                      )}
                    </Button>
                  </NavLink>
                )}
                {!role ? (
                  <>
                    <NavLink to='/login'>
                      <Button shape='circle' color='ghost' size='sm'>
                        <GoPerson className='text-lg' />
                      </Button>
                    </NavLink>
                  </>
                ) : (
                  <Dropdown horizontal='center' vertical='end'>
                    <Dropdown.Toggle color='ghost' size='sm'>
                      <GoPerson className='text-lg' />
                    </Dropdown.Toggle>
                    <Dropdown.Menu className='w-52 text-base-content'>
                      {(validateUserRole(role) === Role.Buyer ||
                        validateUserRole(role) === Role.Seller) && (
                        <>
                          <Dropdown.Item onClick={handleProfileClick}>
                            <CgProfile className='text-xl' />
                            <span>Profile</span>
                          </Dropdown.Item>
                          <Dropdown.Item onClick={handleShopClick}>
                            <BsShop className='text-xl' />
                            <span>My Shop</span>
                          </Dropdown.Item>
                        </>
                      )}
                      <Dropdown.Item onClick={handleLogoutClick}>
                        <CgLogOut className='text-xl' />
                        <span>Logout</span>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}
              </div>
            </div>
          </Navbar>
        </div>
      </header>
    </>
  );
};

export default Header;
