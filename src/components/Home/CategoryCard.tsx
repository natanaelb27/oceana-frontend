import { Link } from 'react-router-dom';
import { Category } from '../../types/component';
import { Image } from '../common';
import { StyledCategoryCard } from './style';

type CategoryCardProps = {
  category: Category;
  to: string;
};

const CategoryCard = ({ category, to }: CategoryCardProps) => {
  return (
    <Link to={to}>
      <StyledCategoryCard>
        <Image
          src={category.image || ''}
          alt={category.name || ''}
          className='h-12 w-12 md:h-16 md:w-16'
        />
        <h3 className='line-clamp-1'>{category.name}</h3>
      </StyledCategoryCard>
    </Link>
  );
};

export default CategoryCard;
