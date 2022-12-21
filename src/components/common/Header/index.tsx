import React, { ChangeEvent, FormEvent, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  Divider,
  Dropdown,
  Form,
  Input,
  InputGroup,
  Navbar,
} from 'react-daisyui';
import { FaSearch, FaShoppingCart } from 'react-icons/fa';
import { GoPerson } from 'react-icons/go';
import { HiMoon, HiSun } from 'react-icons/hi';
import { CgLogOut, CgProfile } from 'react-icons/cg';

import { useLocalStorage, useScrollPosition } from '../../../hooks';
import { selectRole, unsetCredentials } from '../../../store/slices/authSlice';
import { baseApi, useAppDispatch, useAppSelector } from '../../../store/store';
import { useLogoutMutation } from '../../../store/services/profileService';
import { TAG_TYPES } from '../../../constants/tags';
import { BsShop } from 'react-icons/bs';
import { useGetUserCartQuery } from '../../../store/services/cartService';
import { toRupiah } from '../../../utils/convert';

const Header = () => {
  const role = useAppSelector(selectRole);
  const scrollPosition = useScrollPosition();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();
  const [hoverCart, setHoverCart] = useState(false);
  const { data: userCartData } = useGetUserCartQuery();
  const [theme, setTheme] = useLocalStorage<string>(
    'theme',
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );

  const [search, setSearch] = useState<string>('');

  console.log({ userCartData });

  const hanldeSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleHoverCart = () => {
    setHoverCart(true);
  };

  const handleUnhoverCart = () => {
    setHoverCart(false);
  };

  const renderHoverCart = () => {
    if (!userCartData?.data) {
      return null;
    }

    if (userCartData.data.length === 0) {
      return null;
    }

    let totalItems = 0;

    if (hoverCart) {
      return (
        <div
          className='absolute bg-base-100 rounded-xl border-none shadow-lg top-14 right-16 z-50 transition-all duration-300'
          onMouseOver={handleHoverCart}
          onMouseOut={handleUnhoverCart}
        >
          <Card className=' text-base-content w-96'>
            <Card.Body className='p-5 normal-case font-normal'>
              <div className='flex justify-between'>
                <div className='font-bold'>Cart</div>
                <NavLink
                  to='/cart'
                  className=' hover:text-primary'
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
                            className=' hover:text-primary'
                            onClick={() => handleUnhoverCart()}
                          >
                            <div className='flex items-center justify-between text-sm mb-2'>
                              <div className='flex mr-5'>
                                <img
                                  src='https://images.tokopedia.net/img/cache/100-square/product-1/2020/8/25/49295037/49295037_d63120b6-8ab4-4084-9765-a3b679ab18df_1000_1000.webp?ect=4g'
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
                                {toRupiah(product.price)}
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
      );
    }
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
  };

  return (
    <header
      className={`sticky top-0 z-30 w-full component-preview items-center justify-center gap-2 font-sans transition-all duration-100 ${
        scrollPosition > 0
          ? 'py-2 bg-base-100 text-base-content shadow-sm bg-opacity-80 backdrop-blur'
          : 'py-2 bg-primary text-primary-content'
      }`}
    >
      <div className='container mx-auto'>
        <Navbar className='hidden md:flex'>
          <div className='flex-none mr-4'>
            <NavLink to='/'>
              <Button className='text-xl normal-case' color='ghost'>
                Oceana
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
                  className='text-base-content w-full border-none'
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
            <div>
              <NavLink to='/cart' className='relative'>
                <Button
                  shape='circle'
                  color='ghost'
                  size='sm'
                  onMouseOver={handleHoverCart}
                  onMouseOut={handleUnhoverCart}
                >
                  <FaShoppingCart className='text-lg' />
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
        </Navbar>
        <Navbar className='flex md:hidden'>
          <div className='flex-1'>
            <Form onSubmit={handleSearchSubmit} className='w-full'>
              <InputGroup>
                <Input
                  type='text'
                  placeholder='Search...'
                  color='ghost'
                  className='text-base-content w-full border-none placeholder:text-base-content'
                  value={search}
                  onChange={hanldeSearchChange}
                />
                <Button shape='square' color='ghost'>
                  <FaSearch />
                </Button>
              </InputGroup>
            </Form>
          </div>
          <div className='flex-none ml-4'>
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
              <Button shape='circle' color='ghost' size='sm'>
                <FaShoppingCart className='text-lg' />
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
        </Navbar>
      </div>
      <div
        className={`${
          hoverCart ? 'absolute' : 'hidden'
        } mt-2 w-screen h-screen bg-black bg-opacity-40 transition-all duration-100`}
      ></div>
    </header>
  );
};

export default Header;
