import { Link } from 'react-router-dom';
import { Category } from '../../types/component';
import { StyledCategoryCard } from './style';

type CategoryCardProps = {
  category: Category;
  to: string;
};

const CategoryCard = ({ category, to }: CategoryCardProps) => {
  return (
    <Link to={to}>
      <StyledCategoryCard>
        <img
          src={category.image || ''}
          alt={category.name || ''}
          className='h-12 w-12 md:h-16 md:w-16'
        />
        <h3 className='break-words leading-none md:text-xl'>{category.name}</h3>
      </StyledCategoryCard>
    </Link>
  );
};

export default CategoryCard;
