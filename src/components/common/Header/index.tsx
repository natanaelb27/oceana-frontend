import { ChangeEvent, FormEvent, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Form, Input, InputGroup, Navbar } from 'react-daisyui';
import { FaSearch, FaShoppingCart } from 'react-icons/fa';
import { GoPerson } from 'react-icons/go';

import { useScrollPosition } from '../../../hooks';

const Header = () => {
  const scrollPosition = useScrollPosition();

  const [search, setSearch] = useState<string>('');

  const hanldeSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
            <Button className='text-xl normal-case' color='ghost'>
              Oceana
            </Button>
          </div>
          <div className='flex-1'>
            <Form onSubmit={handleFormSubmit} className='w-full'>
              <InputGroup>
                <Input
                  type='text'
                  placeholder='Search...'
                  color='ghost'
                  className='text-base-content w-full'
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
            <Button shape='circle' color='ghost'>
              <FaShoppingCart />
            </Button>
            <NavLink to='/login'>
              <Button color='ghost'>Login</Button>
            </NavLink>
            <NavLink to='/register'>
              <Button color='ghost'>Register</Button>
            </NavLink>
          </div>
        </Navbar>
        <Navbar className='flex md:hidden'>
          <div className='flex-1'>
            <Form onSubmit={handleFormSubmit} className='w-full'>
              <InputGroup>
                <Input
                  type='text'
                  placeholder='Search...'
                  color='ghost'
                  className='text-base-content w-full'
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
            <NavLink to='/cart'>
              <Button shape='circle' color='ghost'>
                <FaShoppingCart />
              </Button>
            </NavLink>
            <NavLink to='/login'>
              <Button shape='circle' color='ghost'>
                <GoPerson />
              </Button>
            </NavLink>
          </div>
        </Navbar>
      </div>
    </header>
  );
};

export default Header;
