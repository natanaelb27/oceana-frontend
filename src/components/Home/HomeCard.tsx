import { ReactNode } from 'react';
import { Link } from 'react-daisyui';
import { HomeCardContainer, HomeCardTitle } from './style';

type HomeCardProps = {
  children: ReactNode;
  title: string;
  navigateSeeAll: string;
};

const HomeCard = ({ children, title, navigateSeeAll }: HomeCardProps) => {
  return (
    <HomeCardContainer>
      <div className='flex items-start gap-2'>
        <Link
          href={navigateSeeAll}
          className='hover:text-secondary hover:no-underline'
        >
          <HomeCardTitle>{title}</HomeCardTitle>
        </Link>
      </div>
      {children}
    </HomeCardContainer>
  );
};

export default HomeCard;
