import { ChangeEvent, FormEvent, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Button,
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
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { validateUserRole } from '../../../utils/auth';
import { Role } from '../../../types/role';

const Header = () => {
  const role = useAppSelector(selectRole);
  const scrollPosition = useScrollPosition();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [theme, setTheme] = useLocalStorage<string>(
    'theme',
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );

  const [search, setSearch] = useState<string>('');

  const hanldeSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
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

    navigate('/');
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
        {validateUserRole(role) === Role.Buyer && <NavLink to="/seller/registration">Seller Center</NavLink>}
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
            <NavLink to='/cart'>
              <Button shape='circle' color='ghost' size='sm'>
                <FaShoppingCart className='text-lg' />
              </Button>
            </NavLink>
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
    </header>
  );
};

export default Header;
