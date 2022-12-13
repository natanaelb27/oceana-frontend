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
          onError={({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src =
              'https://cdn.shopify.com/s/files/1/0332/8881/4637/products/noimageavailable_7b25b64a-d5f8-423b-a498-8a2785ea69b2_2000x.jpg?v=1669356395';
          }}
        />
        <h3 className='break-words leading-none md:text-xl'>{category.name}</h3>
      </StyledCategoryCard>
    </Link>
  );
};

export default CategoryCard;
