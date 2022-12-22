import { ReactNode } from 'react';
import { Card } from 'react-daisyui';
import { Link } from 'react-router-dom';

type HomeCardProps = {
  id: string;
  children: ReactNode;
  title: string;
  subtitle: string;
  navigateSeeAll?: string;
};

const HomeCard = ({
  id,
  children,
  title,
  subtitle,
  navigateSeeAll,
}: HomeCardProps) => {
  return (
    <div
      id={id}
      className='shadow rounded-2xl bg-gradient-to-r from-primary to-secondary pb-1'
    >
      <Card className='h-full w-full bg-base-100'>
        <Card.Body>
          <Link
            to={navigateSeeAll || '/'}
            className='link no-underline hover:text-primary hover:no-underline text-xl md:text-2xl font-medium text-center md:text-left'
          >
            {title}
          </Link>
          <span className='font-light text-sm md:text-md mb-2.5 text-center md:text-left'>
            {subtitle}
          </span>
          {children}
        </Card.Body>
      </Card>
    </div>
  );
};

export default HomeCard;
