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
import { FaSearch, FaShoppingCart } from 'react-icons/fa';
import { GoPerson } from 'react-icons/go';
import { HiMoon, HiSun } from 'react-icons/hi';
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
import { toRupiah } from '../../../utils/convert';
import { roleCodeToText } from '../../../utils/roleCodeToText';
import NoData from '../NoData';
import Image from '../Image';
import ClassNames from '../../../utils/classnames';

const Header = () => {
  const role = useAppSelector(selectRole);
  const scrollPosition = useScrollPosition();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();
  const [hoverCart, setHoverCart] = useState(false);
  const [hoverProfile, setHoverProfile] = useState(false);
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
    if (role !== null) {
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

  const handleHoverCart = () => {
    if (role !== null) {
      setHoverCart(true);
    }
  };

  const handleUnhoverCart = () => {
    setHoverCart(false);
  };

  const handleHoverProfile = () => {
    setHoverProfile(true);
  };

  const handleUnhoverProfile = () => {
    setHoverProfile(false);
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
          <Card className=' text-base-content w-96 p-5 normal-case font-normal gap-1'>
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
          hoverCart || hoverProfile
            ? 'opacity-100 w-full h-full transition-bg-blur-hover-on'
            : ' opacity-0 h-0 transition-bg-blur-hover-off'
        } absolute w-full h-full overlay bg-black bg-opacity-40 backdrop-blur-sm z-30`}
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
            </div>
            <div className='flex-none ml-4 gap-2'>
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
              <div className='relative'>
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
              {!role ? (
                <>
                  <NavLink to='/login'>
                    <Button color='ghost'>Login</Button>
                  </NavLink>
                  <NavLink to='/register'>
                    <Button color='ghost'>Register</Button>
                  </NavLink>
                </>
              ) : (
                <div className='relative'>
                  <div onClick={handleProfileClick}>
                    <Button
                      color='ghost'
                      size='sm'
                      onMouseOver={handleHoverProfile}
                      onMouseOut={handleUnhoverProfile}
                    >
                      <GoPerson className='text-lg' />
                    </Button>
                  </div>
                  {renderHoverProfile()}
                </div>
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
                      <Dropdown.Item onClick={handleProfileClick}>
                        <CgProfile className='text-xl' />
                        <span>Profile</span>
                      </Dropdown.Item>
                      <Dropdown.Item onClick={handleShopClick}>
                        <BsShop className='text-xl' />
                        <span>My Shop</span>
                      </Dropdown.Item>
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
