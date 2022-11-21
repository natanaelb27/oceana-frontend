import { ReactNode } from 'react';
import { HomeCardContainer, HomeCardTitle } from './style';

type HomeCardProps = {
  children: ReactNode;
  title: string;
};

export const HomeCard = ({ title, children }: HomeCardProps) => {
  return (
    <HomeCardContainer>
      <HomeCardTitle>{title}</HomeCardTitle>
      {children}
    </HomeCardContainer>
  );
};
